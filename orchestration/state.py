"""
LangGraph shared state definition.
Scheduling fields added at bottom — all other fields unchanged.
"""

from __future__ import annotations
from typing import Any, Literal, TypedDict


class PipelineState(TypedDict, total=False):
    # ── Set by webhook / trigger layer ──────────────────────────────────────
    patient_id: str
    image_s3_key: str
    webhook_event: dict[str, Any]

    # ── Set by PatientManagementAgent ────────────────────────────────────────
    patient_record: dict[str, Any]

    # ── Set by MCP resolution (orchestrator populates before routing) ────────
    # MCP 1: healthimaging-mcp-server
    imaging_context: dict[str, Any] | None
    # MCP 2: patient-history-mcp (your custom MCP)
    patient_history_context: dict[str, Any] | None

    # ── Set by DiagnosticAgent ───────────────────────────────────────────────
    diagnostic_summary: str
    recommended_specialty: str
    confidence_score: float
    urgency: Literal["critical", "high", "medium", "low"]

    # ── Set by SchedulingAgent ───────────────────────────────────────────────
    appointment: dict[str, Any] | None
    notification_result: dict[str, Any] | None
    scheduling_status: Literal["success", "failed", "escalated"] | None
    scheduling_error: str | None
