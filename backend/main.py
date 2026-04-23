import os
import tempfile
import pandas as pd  # FIXED: Moved to top level
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Dict, Any

# LangChain Imports for Policy Ingestion
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Agent Imports
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
db = mongo_client["operon_ai"]

# Initialize Agents
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
    """
    proposed_action = data.get("proposed_action", "No action specified")
    csv_data = data.get("csv_data", [])
    
    if not csv_data:
        raise HTTPException(status_code=400, detail="No CSV data provided")
    
    df = pd.DataFrame(csv_data)
    
    # 1. Data Analyst
    da_report = data_analyst.analyze_data(df)
    
    # 2. Policy Guardian
    pg_report = await policy_guardian.check_compliance(proposed_action)
    
    # 3. Simulation Strategist
    base_impact = data.get("base_impact", 100.0)
    ss_report = simulation_strategist.simulate_what_if(proposed_action, {"impact": base_impact})
    
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

@app.post("/upload-policy")
async def upload_policy(file: UploadFile = File(...)):
    """
    Handles PDF uploads from the frontend and adds them to the vector search index.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    # Use a temporary file to process the upload
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        content = await file.read()
        temp_file.write(content)
        temp_path = temp_file.name

    try:
        # 1. Load and Split the PDF (Logic from your ingest_policies.py)
        loader = PyPDFLoader(temp_path)
        documents = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = text_splitter.split_documents(documents)
        
        # 2. Add to the existing vector search index in PolicyGuardian
        # This allows the guardian to immediately use the new policy
        policy_guardian.vector_search.add_documents(chunks)
        
        return {
            "message": f"Successfully indexed {len(chunks)} chunks from {file.filename}",
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process policy: {str(e)}")
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)