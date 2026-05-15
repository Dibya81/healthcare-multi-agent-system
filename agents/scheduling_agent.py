"""
Scheduling Agent - Autonomous appointment booking and notification dispatch.

Inputs (from orchestrator via LangGraph state):
  - patient_id: str
  - urgency: "critical" | "high" | "medium" | "low"
  - diagnostic_summary: str          # from DiagnosticAgent
  - recommended_specialty: str       # from DiagnosticAgent
  - imaging_context: dict | None     # from HealthImaging MCP (passed through)
  - patient_history_context: dict | None  # from PatientHistory MCP (passed through)

Outputs (written back to LangGraph state):
  - appointment: dict
  - notification_result: dict
  - scheduling_status: "success" | "failed" | "escalated"
  - scheduling_error: str | None

MCP Dependencies (resolved UPSTREAM by orchestrator, passed as context):
  1. healthimaging-mcp-server  → imaging_context
  2. patient-history-mcp       → patient_history_context

This agent does NOT call MCP directly. It receives pre-resolved context
so the orchestrator controls MCP lifecycle and credits.
"""

from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Literal

import boto3
from botocore.exceptions import ClientError

from tools.notifications import send_notification  # your existing tool

logger = logging.getLogger(__name__)

# ── Urgency → slot offset (hours from now) ─────────────────────────────────
URGENCY_SLOT_MAP: dict[str, int] = {
    "critical": 2,
    "high": 24,
    "medium": 72,
    "low": 168,  # 1 week
}

# ── Urgency → notification channel ─────────────────────────────────────────
URGENCY_CHANNEL_MAP: dict[str, list[str]] = {
    "critical": ["sms", "email", "push"],
    "high": ["sms", "email"],
    "medium": ["email"],
    "low": ["email"],
}


# ────────────────────────────────────────────────────────────────────────────
# Public entry point — called by LangGraph node
# ────────────────────────────────────────────────────────────────────────────

def run(state: dict[str, Any]) -> dict[str, Any]:
    """
    LangGraph node function. Reads from state, returns state delta.

    Required state keys:
        patient_id, urgency, diagnostic_summary, recommended_specialty

    Optional state keys (from MCP context resolved upstream):
        imaging_context, patient_history_context
    """
    patient_id: str = state["patient_id"]
    urgency: str = state.get("urgency", "medium").lower()
    diagnostic_summary: str = state.get("diagnostic_summary", "")
    recommended_specialty: str = state.get("recommended_specialty", "General Practice")
    imaging_context: dict | None = state.get("imaging_context")        # MCP 1
    patient_history_context: dict | None = state.get("patient_history_context")  # MCP 2

    logger.info(
        "[SchedulingAgent] Starting | patient=%s urgency=%s specialty=%s",
        patient_id, urgency, recommended_specialty,
    )

    try:
        # 1. Enrich appointment payload with MCP context
        appointment_notes = _build_appointment_notes(
            diagnostic_summary, imaging_context, patient_history_context
        )

        # 2. Find or mock an available slot
        slot = _find_slot(urgency, recommended_specialty)

        # 3. Book the appointment (DB write)
        appointment = _book_appointment(
            patient_id=patient_id,
            slot=slot,
            specialty=recommended_specialty,
            urgency=urgency,
            notes=appointment_notes,
        )

        # 4. Send notifications via SNS / console fallback
        channels = URGENCY_CHANNEL_MAP.get(urgency, ["email"])
        notification_result = send_notification(
            patient_id=patient_id,
            appointment=appointment,
            channels=channels,
            urgency=urgency,
        )

        logger.info(
            "[SchedulingAgent] Done | appointment_id=%s", appointment["appointment_id"]
        )

        return {
            "appointment": appointment,
            "notification_result": notification_result,
            "scheduling_status": "success",
            "scheduling_error": None,
        }

    except _EscalationRequired as exc:
        logger.warning("[SchedulingAgent] Escalation required: %s", exc)
        return {
            "appointment": None,
            "notification_result": None,
            "scheduling_status": "escalated",
            "scheduling_error": str(exc),
        }

    except Exception as exc:  # noqa: BLE001
        logger.exception("[SchedulingAgent] Unexpected failure")
        return {
            "appointment": None,
            "notification_result": None,
            "scheduling_status": "failed",
            "scheduling_error": str(exc),
        }


# ────────────────────────────────────────────────────────────────────────────
# Internal helpers
# ────────────────────────────────────────────────────────────────────────────

class _EscalationRequired(Exception):
    """Raise when the case must go to a human coordinator."""


def _build_appointment_notes(
    diagnostic_summary: str,
    imaging_context: dict | None,
    patient_history_context: dict | None,
) -> str:
    """
    Combine inputs from both MCPs into a compact clinical note for the appointment record.
    Keeps tokens minimal — only key fields are extracted.
    """
    parts: list[str] = []

    if diagnostic_summary:
        parts.append(f"Diagnosis: {diagnostic_summary[:500]}")

    if imaging_context:
        # HealthImaging MCP returns image set metadata; extract the useful bits
        image_set_id = imaging_context.get("imageSetId", "unknown")
        modality = imaging_context.get("modality", "")
        study_date = imaging_context.get("studyDate", "")
        parts.append(
            f"Imaging ref: imageSetId={image_set_id} modality={modality} date={study_date}"
        )

    if patient_history_context:
        # PatientHistory MCP — extract allergies + last visit for the clinician
        allergies = patient_history_context.get("allergies", [])
        last_visit = patient_history_context.get("lastVisitDate", "N/A")
        chronic = patient_history_context.get("chronicConditions", [])
        parts.append(
            f"History: last_visit={last_visit} "
            f"allergies={', '.join(allergies) or 'none'} "
            f"chronic={', '.join(chronic) or 'none'}"
        )

    return " | ".join(parts) if parts else "No additional context."


def _find_slot(urgency: str, specialty: str) -> dict[str, Any]:
    """
    Slot finder.

    Production path  → query your real scheduling DB / EHR calendar API.
    Current path     → deterministic mock (no external call, zero cost).
    Swap in your DB query here without touching the rest of the agent.
    """
    hours_offset = URGENCY_SLOT_MAP.get(urgency, 72)
    slot_dt = datetime.now(timezone.utc) + timedelta(hours=hours_offset)

    # TODO: Replace mock with real slot query
    # slot_dt = _query_ehr_calendar(specialty, earliest=slot_dt)

    if urgency == "critical" and hours_offset > 4:
        raise _EscalationRequired(
            f"No critical slot available within 2 h for {specialty}. "
            "Escalating to on-call coordinator."
        )

    return {
        "slot_datetime_utc": slot_dt.isoformat(),
        "specialty": specialty,
        "provider_id": f"PROV-{specialty[:4].upper()}-001",  # mock provider
        "location": "Telemedicine" if urgency in ("medium", "low") else "In-Person",
    }


def _book_appointment(
    patient_id: str,
    slot: dict[str, Any],
    specialty: str,
    urgency: str,
    notes: str,
) -> dict[str, Any]:
    """
    Writes appointment to the database.

    Current implementation → local JSON store (data/appointments.json).
    Production swap        → replace _write_to_json_store with your DB call.
    """
    appointment_id = f"APT-{uuid.uuid4().hex[:8].upper()}"
    appointment = {
        "appointment_id": appointment_id,
        "patient_id": patient_id,
        "specialty": specialty,
        "urgency": urgency,
        "slot_datetime_utc": slot["slot_datetime_utc"],
        "provider_id": slot["provider_id"],
        "location": slot["location"],
        "notes": notes,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "confirmed",
    }

    _write_to_json_store(appointment)
    logger.info("[SchedulingAgent] Appointment booked: %s", appointment_id)
    return appointment


def _write_to_json_store(appointment: dict[str, Any]) -> None:
    """Append to data/appointments.json (existing project mock store)."""
    import os

    store_path = os.path.join(
        os.path.dirname(__file__), "..", "data", "appointments.json"
    )
    store_path = os.path.normpath(store_path)

    try:
        with open(store_path, "r", encoding="utf-8") as f:
            records: list = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        records = []

    records.append(appointment)

    with open(store_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)
