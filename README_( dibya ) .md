# Scheduling Agent — Integration Guide

## What This Agent Does
The Scheduling Agent is the final action node in the pipeline. It receives enriched
context from upstream agents and MCPs, books an appointment, and dispatches notifications.
It owns **no MCP connections directly** — all MCP context is resolved by the Orchestrator
and passed via LangGraph state.

---

## Folder Ownership

```
agents/scheduling_agent.py     ← YOUR FILE (scheduling team owns this)
tools/notifications.py         ← YOUR FILE (shared with alerting team)
orchestration/state.py         ← SHARED (scheduling fields added at bottom)
orchestration/graph.py         ← SHARED (add scheduling node — see snippet below)
data/appointments.json         ← SHARED mock store
```

---

## State Contract

### Inputs (from upstream agents/MCPs via LangGraph state)

| Key | Type | Set by | Required |
|-----|------|--------|----------|
| `patient_id` | `str` | Webhook / PatientMgmt | ✅ |
| `urgency` | `"critical"\|"high"\|"medium"\|"low"` | DiagnosticAgent | ✅ |
| `diagnostic_summary` | `str` | DiagnosticAgent | ✅ |
| `recommended_specialty` | `str` | DiagnosticAgent | ✅ |
| `imaging_context` | `dict\|None` | Orchestrator via HealthImaging MCP | optional |
| `patient_history_context` | `dict\|None` | Orchestrator via PatientHistory MCP | optional |

### Outputs (written back to LangGraph state)

| Key | Type | Description |
|-----|------|-------------|
| `appointment` | `dict\|None` | Full appointment record (also written to `data/appointments.json`) |
| `notification_result` | `dict\|None` | SNS message ID or console log reference |
| `scheduling_status` | `"success"\|"failed"\|"escalated"` | Terminal status |
| `scheduling_error` | `str\|None` | Error message on failure |

---

## MCP Integration

### MCP 1 — HealthImaging (`healthimaging-mcp-server`)

**Who calls it:** Orchestrator Agent  
**When:** Before routing to SchedulingAgent  
**Tool used:** `search_image_sets`  
**What scheduling receives:** `state["imaging_context"]`

```python
# Expected imaging_context shape:
{
    "imageSetId": "abc123",
    "datastoreId": "ds-xyz",
    "modality": "CT",
    "studyDate": "20250515"
}
```

**Docker config** (add to your MCP client setup):
```json
{
  "mcpServers": {
    "awslabs.healthimaging-mcp-server": {
      "command": "docker",
      "args": [
        "run", "--rm", "--interactive",
        "--env", "AWS_REGION=us-east-1",
        "--volume", "/full/path/to/.aws:/app/.aws",
        "awslabs/healthimaging-mcp-server:latest"
      ]
    }
  }
}
```

**Required env var:** `HEALTHIMAGING_DATASTORE_ID`

---

### MCP 2 — Patient History (your custom MCP)

**Who calls it:** Orchestrator Agent  
**When:** Before routing to SchedulingAgent  
**What scheduling receives:** `state["patient_history_context"]`

```python
# Expected patient_history_context shape (define with your DB team):
{
    "lastVisitDate": "2025-03-10",
    "allergies": ["penicillin"],
    "chronicConditions": ["Type 2 Diabetes"],
    "preferredPharmacy": "Apollo Pharmacy, Indiranagar"
}
```

Both MCP results are **optional** — if either MCP fails, the scheduling agent
continues without crashing (graceful degradation).

---

## Wiring into LangGraph (graph.py)

```python
from agents import scheduling_agent

workflow.add_node("scheduling", scheduling_agent.run)
workflow.add_edge("diagnostic", "scheduling")
# OR with conditional routing:
workflow.add_conditional_edges(
    "diagnostic",
    route_after_diagnostic,
    {"schedule": "scheduling", "escalate": "alerting"},
)
```

---

## Urgency → Slot Timing

| Urgency | Slot offset | Channels |
|---------|------------|----------|
| critical | 2 hours | SMS + Email + Push |
| high | 24 hours | SMS + Email |
| medium | 72 hours | Email |
| low | 1 week | Email |

---

## Environment Variables

```env
# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# SNS (optional — console fallback if not set)
SNS_TOPIC_ARN_CRITICAL=arn:aws:sns:us-east-1:123456789:critical-alerts
SNS_TOPIC_ARN_DEFAULT=arn:aws:sns:us-east-1:123456789:appointment-notifications

# HealthImaging MCP
HEALTHIMAGING_DATASTORE_ID=your-datastore-id
```

---

## Local Dev (no AWS needed)

Leave `SNS_TOPIC_ARN_*` unset → notifications fall back to console logs.  
`data/appointments.json` is the mock DB → already in .gitignore-safe mock data.  
No MCP needed locally → pass `imaging_context=None, patient_history_context=None` in test state.

---

## Test Stub

```python
# tests/test_agents.py  — add this block
from agents import scheduling_agent

def test_scheduling_happy_path():
    state = {
        "patient_id": "P-001",
        "urgency": "high",
        "diagnostic_summary": "Suspected cellulitis on left forearm.",
        "recommended_specialty": "Dermatology",
        "imaging_context": {
            "imageSetId": "img-abc",
            "datastoreId": "ds-xyz",
            "modality": "Dermoscopy",
            "studyDate": "20250515",
        },
        "patient_history_context": {
            "lastVisitDate": "2025-01-10",
            "allergies": ["sulfa"],
            "chronicConditions": [],
        },
    }
    result = scheduling_agent.run(state)
    assert result["scheduling_status"] == "success"
    assert result["appointment"]["specialty"] == "Dermatology"
    assert result["notification_result"] is not None
```

---

## Files Changed vs Original Structure

| File | Change | Why |
|------|--------|-----|
| `agents/scheduling_agent.py` | **New (yours)** | Core scheduling logic |
| `tools/notifications.py` | **New / replaced** | SNS + console fallback |
| `orchestration/state.py` | **Append only** | Added 4 scheduling output fields |
| `orchestration/graph.py` | **+3 lines** | Wire scheduling node |
| `data/appointments.json` | **Runtime write** | Mock store, no schema change |
