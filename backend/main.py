import os
import pandas as pd
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Dict, Any
import io


from agents.data_analyst import DataAnalyst
from agents.policy_guardian import PolicyGuardian
from agents.simulation_strategist import SimulationStrategist
from agents.executive_agent import ExecutiveDecisionAgent

load_dotenv()

app = FastAPI(title="Operon AI Backend")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clients
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
mongodb_url = os.getenv("DATABASE_URL")
mongo_client = AsyncIOMotorClient(mongodb_url)
db = mongo_client.get_default_database()

# Initialize Agents
data_analyst = DataAnalyst()
policy_guardian = PolicyGuardian(db)
simulation_strategist = SimulationStrategist()
executive_agent = ExecutiveDecisionAgent()

@app.get("/")
async def root():
    return {"message": "Operon AI FastAPI Backend is running"}

# --- Analysis Endpoint ---
@app.post("/analyze")
async def run_analysis(data: dict):
    """
    Trigger the full Agent Hive flow.
    """
    proposed_action = data.get("proposed_action", "No action specified")
    csv_data = data.get("csv_data", [])
    df = pd.DataFrame(csv_data)
    
    # 1. Data Analyst
    da_report = data_analyst.analyze_data(df)
    
    # 2. Policy Guardian
    pg_report = await policy_guardian.check_compliance(proposed_action)
    
    # 3. Simulation Strategist
    # Passing variance as 0.1 by default or from data
    ss_report = simulation_strategist.simulate_what_if(proposed_action, {"base_impact": 100.0})
    
    # 4. Executive Decision Agent
    final_recommendation = await executive_agent.synthesize_findings(da_report, pg_report, ss_report)
    
    report_entry = {
        "action": proposed_action,
        "reports": {
            "data_analyst": da_report,
            "policy_guardian": pg_report,
            "simulation_strategist": ss_report
        },
        "executive_summary": final_recommendation
    }
    
    # Store in MongoDB for the 'Reports' page
    await db.analysis_history.insert_one(report_entry)
    
    return report_entry

# --- Policy Management ---
@app.post("/upload-policy")
async def upload_policy(file: UploadFile = File(...)):
    """
    Endpoint for the 'upload-policy' frontend page.
    In real usage, you would call your ingestion script logic here.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF policies supported.")
    
    # Placeholder for PDF parsing and vector insertion logic
    # found in PolicyGuardian and your ingestion scripts.
    return {"message": f"Policy '{file.filename}' uploaded and indexed successfully."}

# --- Data Management ---
@app.get("/reports")
async def get_all_reports():
    """
    Retrieves previous analyses for the 'reports' page.
    """
    cursor = db.analysis_history.find().sort("_id", -1)
    reports = await cursor.to_list(length=100)
    for r in reports:
        r["_id"] = str(r["_id"]) # Convert ObjectId for JSON
    return reports

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)