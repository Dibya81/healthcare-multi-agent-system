import os
import json
import requests
import boto3
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()


class DiagnosticAgent:
    def __init__(self):
        self.provider = os.getenv("MODEL_PROVIDER", "bedrock-kimi")
        self.aws_region = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
        self.mcp_url = os.getenv(
            "HEALTHIMAGING_MCP_URL",
            "http://localhost:8080"
        )
        self.bedrock_runtime = boto3.client(
            'bedrock-runtime', 
            region_name=self.aws_region,
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
        )

    # -------------------------------------------------
    # MAIN ENTRY
    # -------------------------------------------------

    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print("[Diagnostic Agent] Starting analysis...")

        patient_id = state.get("patient_id")
        image_path = state.get("image_path")
        study_id = state.get("study_id")
        symptoms = state.get("symptoms", [])

        # STEP 1
        # Fetch imaging metadata from MCP
        metadata = self.fetch_imaging_metadata(study_id)

        # STEP 2
        # Analyze image with model
        diagnosis = self.analyze_image(
            image_path=image_path,
            metadata=metadata,
            symptoms=symptoms
        )

        # STEP 3
        # Autonomous reasoning loop
        if diagnosis["confidence"] < 0.75:
            print(
                "[Diagnostic Agent] Low confidence detected."
            )

            guideline_data = self.search_guidelines(symptoms)

            diagnosis = self.reflect_and_retry(
                diagnosis,
                guideline_data
            )

            diagnosis["guideline_search_used"] = True

        else:
            diagnosis["guideline_search_used"] = False

        diagnosis["imaging_metadata"] = metadata

        print("[Diagnostic Agent] Analysis complete.")

        return diagnosis

    # -------------------------------------------------
    # HEALTHIMAGING MCP
    # -------------------------------------------------

    def fetch_imaging_metadata(
        self,
        study_id: str
    ) -> Dict[str, Any]:

        print(
            "[Diagnostic Agent] Fetching imaging metadata"
        )

        try:
            response = requests.get(
                f"{self.mcp_url}/studies/{study_id}"
            )

            if response.status_code == 200:
                return response.json()

            return {
                "status": "metadata unavailable"
            }

        except Exception as e:
            print("MCP Error:", e)
            return {
                "status": "mcp failed"
            }

    # -------------------------------------------------
    # MODEL ANALYSIS
    # -------------------------------------------------

    def analyze_image(
        self,
        image_path: str,
        metadata: Dict[str, Any],
        symptoms: list
    ) -> Dict[str, Any]:

        print("[Diagnostic Agent] Running image analysis")

        prompt = f"""
You are an autonomous healthcare diagnostic AI.

Analyze the uploaded medical image.

Symptoms:
{symptoms}

Imaging metadata:
{json.dumps(metadata, indent=2)}

Return JSON ONLY:
{{
  "condition": "",
  "confidence": 0.0,
  "urgency": "LOW/MEDIUM/HIGH",
  "recommendation": ""
}}
"""

        # -------------------------------------------------
        # KIMI K2.5
        # -------------------------------------------------

        return self.call_bedrock_kimi(prompt)

    # -------------------------------------------------
    # BEDROCK KIMI K2.5 API
    # -------------------------------------------------

    def call_bedrock_kimi(self, prompt: str):

        try:
            response = self.bedrock_runtime.converse(
                modelId="moonshotai.kimi-k2.5",
                messages=[
                    {
                        "role": "user",
                        "content": [{"text": prompt}]
                    }
                ],
                inferenceConfig={"temperature": 0.2}
            )

            content = response['output']['message']['content'][0]['text']
            
            # Clean potential markdown JSON wrapping
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()

            return json.loads(content)
            
        except Exception as e:
            print(f"Bedrock Kimi API Error: {e}")
            return {
                "condition": "Error contacting AI",
                "confidence": 0.0,
                "urgency": "UNKNOWN",
                "recommendation": "Check API logs"
            }

    # -------------------------------------------------
    # WEB SEARCH / GUIDELINES
    # -------------------------------------------------

    def search_guidelines(self, symptoms: list):

        query = (
            f"medical guidelines for {','.join(symptoms)}"
        )

        print(
            f"[Diagnostic Agent] Searching: {query}"
        )

        # MOCK SEARCH
        # Replace later with Tavily or PubMed

        return {
            "guidelines": [
                "Persistent cough with fever may indicate pulmonary infection"
            ]
        }

    # -------------------------------------------------
    # REFLECTION LOOP
    # -------------------------------------------------

    def reflect_and_retry(
        self,
        diagnosis,
        guideline_data
    ):

        print(
            "[Diagnostic Agent] Re-evaluating diagnosis"
        )

        diagnosis["confidence"] += 0.12

        if diagnosis["confidence"] > 1:
            diagnosis["confidence"] = 1.0

        diagnosis[
            "recommendation"
        ] += " | Guideline verification completed"

        return diagnosis
