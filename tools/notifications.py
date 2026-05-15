"""
Notification tool — SNS primary, console fallback.

Called by SchedulingAgent. Supports sms / email / push channels.
Add your actual SNS topic ARNs in .env:
    SNS_TOPIC_ARN_CRITICAL=arn:aws:sns:...
    SNS_TOPIC_ARN_DEFAULT=arn:aws:sns:...
"""

from __future__ import annotations

import json
import logging
import os
from typing import Any

import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

_SNS_TOPIC_MAP: dict[str, str] = {
    "critical": os.getenv("SNS_TOPIC_ARN_CRITICAL", ""),
    "default": os.getenv("SNS_TOPIC_ARN_DEFAULT", ""),
}


def send_notification(
    patient_id: str,
    appointment: dict[str, Any],
    channels: list[str],
    urgency: str,
) -> dict[str, Any]:
    """
    Dispatch appointment notification.

    Returns a result dict that gets stored in LangGraph state
    under notification_result.
    """
    message = _build_message(patient_id, appointment, urgency)
    topic_arn = _SNS_TOPIC_MAP.get(urgency, _SNS_TOPIC_MAP["default"])

    if topic_arn:
        return _send_via_sns(topic_arn, message, appointment["appointment_id"], channels)
    else:
        return _send_via_console(message, appointment["appointment_id"], channels)


# ── SNS path ────────────────────────────────────────────────────────────────

def _send_via_sns(
    topic_arn: str,
    message: str,
    appointment_id: str,
    channels: list[str],
) -> dict[str, Any]:
    try:
        sns = boto3.client("sns", region_name=os.getenv("AWS_REGION", "us-east-1"))
        response = sns.publish(
            TopicArn=topic_arn,
            Message=message,
            Subject=f"Appointment Confirmation [{appointment_id}]",
            MessageAttributes={
                "channels": {
                    "DataType": "String",
                    "StringValue": ",".join(channels),
                }
            },
        )
        logger.info("[Notifications] SNS published | MessageId=%s", response["MessageId"])
        return {
            "provider": "sns",
            "message_id": response["MessageId"],
            "channels": channels,
            "status": "sent",
        }
    except ClientError as exc:
        logger.warning("[Notifications] SNS failed, falling back to console: %s", exc)
        return _send_via_console(message, appointment_id, channels)


# ── Console fallback (zero cost, always works locally) ──────────────────────

def _send_via_console(
    message: str,
    appointment_id: str,
    channels: list[str],
) -> dict[str, Any]:
    logger.info(
        "[Notifications] CONSOLE FALLBACK | appt=%s channels=%s\n%s",
        appointment_id, channels, message,
    )
    return {
        "provider": "console",
        "message_id": f"LOCAL-{appointment_id}",
        "channels": channels,
        "status": "logged",
    }


# ── Message builder ──────────────────────────────────────────────────────────

def _build_message(
    patient_id: str,
    appointment: dict[str, Any],
    urgency: str,
) -> str:
    return (
        f"APPOINTMENT CONFIRMATION\n"
        f"Patient ID : {patient_id}\n"
        f"Appointment: {appointment['appointment_id']}\n"
        f"Specialty  : {appointment['specialty']}\n"
        f"When       : {appointment['slot_datetime_utc']}\n"
        f"Location   : {appointment['location']}\n"
        f"Urgency    : {urgency.upper()}\n"
        f"Provider   : {appointment['provider_id']}\n"
        f"\nPlease arrive 10 minutes early. Reply CONFIRM to acknowledge."
    )
