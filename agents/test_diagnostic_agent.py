import json
from agents.diagnostic_agent import DiagnosticAgent

def test_agent():
    # Mock state
    state = {
        "patient_id": "P123",
        "image_path": "uploads/chest_xray.png",
        "study_id": "study-001",
        "symptoms": ["cough", "fever"]
    }

    print("--- Starting Test ---")
    agent = DiagnosticAgent()
    
    # We expect this to fail gracefully or return "metadata unavailable" 
    # if the MCP server isn't running.
    # We also expect the analysis to fail if API keys are missing, 
    # but the agent should handle it.
    
    try:
        result = agent.run(state)
        print("\n--- Diagnostic Result ---")
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"\n--- Test Failed with error: {e} ---")

if __name__ == "__main__":
    test_agent()
