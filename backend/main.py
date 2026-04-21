import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
from motor.motor_asyncio import AsyncIOMotorClient

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

# Agents
from agents.data_analyst import DataAnalyst
from agents.policy_guardian import PolicyGuardian
from agents.simulation_strategist import SimulationStrategist
from agents.executive_agent import ExecutiveDecisionAgent

data_analyst = DataAnalyst()
policy_guardian = PolicyGuardian(db)
simulation_strategist = SimulationStrategist()
executive_agent = ExecutiveDecisionAgent()

@app.get("/")
async def root():
    return {"message": "Operon AI FastAPI Backend is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected" if mongo_client else "disconnected"}

@app.post("/analyze")
async def run_analysis(data: dict):
    """
    Trigger the full Agent Hive flow.
    Expects data with 'csv_data' (list of dicts) and 'proposed_action' (string).
    """
    proposed_action = data.get("proposed_action", "No action specified")
    df = pd.DataFrame(data.get("csv_data", []))
    
    # 1. Data Analyst
    da_report = data_analyst.analyze_data(df)
    
    # 2. Policy Guardian
    pg_report = await policy_guardian.check_compliance(proposed_action)
    
    # 3. Simulation Strategist
    ss_report = simulation_strategist.simulate_what_if(proposed_action, {"base_impact": 100.0})
    
    # 4. Executive Decision Agent
    final_recommendation = await executive_agent.synthesize_findings(da_report, pg_report, ss_report)
    
    return {
        "reports": {
            "data_analyst": da_report,
            "policy_guardian": pg_report,
            "simulation_strategist": ss_report
        },
        "executive_summary": final_recommendation
    }

if __name__ == "__main__":
    import uvicorn
    import pandas as pd # Needed for the endpoint
    uvicorn.run(app, host="0.0.0.0", port=8000)
