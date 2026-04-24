import os
import tempfile
import pandas as pd  # FIXED: Moved to top level
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Dict, Any
import numpy as np

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

import json
from bson import ObjectId

import math

def json_serializable(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, (pd.Timestamp, pd.Series, pd.DataFrame)):
        return obj.to_dict()
    if isinstance(obj, np.integer):
        return int(obj)
    if isinstance(obj, np.floating):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return float(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
    return obj

def clean_for_json(data):
    if isinstance(data, dict):
        return {k: clean_for_json(v) for k, v in data.items()}
    if isinstance(data, list):
        return [clean_for_json(i) for i in data]
    return json_serializable(data)

@app.post("/analyze")
async def run_analysis(data: dict):
    """
    Trigger the full Agent Hive flow.
    """
    proposed_action = data.get("proposed_action", "No action specified")
    csv_data = data.get("csv_data", [])
    
    if not csv_data:
        raise HTTPException(status_code=400, detail="No CSV data provided")
    
    try:
        df = pd.DataFrame(csv_data)
        
        # 1. Data Analyst
        try:
            print("Running Data Analyst...")
            da_report = data_analyst.analyze_data(df)
            print("Data Analyst completed.")
        except Exception as e:
            print(f"Data Analyst Error: {e}")
            raise HTTPException(status_code=500, detail=f"Data Analyst failed: {str(e)}")
        
        # 2. Policy Guardian
        try:
            print("Running Policy Guardian...")
            pg_report = await policy_guardian.check_compliance(proposed_action)
            print("Policy Guardian completed.")
        except Exception as e:
            print(f"Policy Guardian Error: {e}")
            raise HTTPException(status_code=500, detail=f"Policy Guardian failed: {str(e)}")
        
        # 3. Simulation Strategist
        try:
            print("Running Simulation Strategist...")
            base_impact = data.get("base_impact", 100.0)
            ss_report = simulation_strategist.simulate_what_if(proposed_action, {"impact": base_impact})
            print("Simulation Strategist completed.")
        except Exception as e:
            print(f"Simulation Strategist Error: {e}")
            raise HTTPException(status_code=500, detail=f"Simulation Strategist failed: {str(e)}")
        
        # 4. Executive Decision Agent
        try:
            print("Running Executive Agent...")
            final_recommendation = await executive_agent.synthesize_findings(da_report, pg_report, ss_report)
            print("Executive Agent completed.")
        except Exception as e:
            print(f"Executive Agent Error: {e}")
            raise HTTPException(status_code=500, detail=f"Executive Agent failed: {str(e)}")
        
        result = {
            "reports": {
                "data_analyst": da_report,
                "policy_guardian": pg_report,
                "simulation_strategist": ss_report
            },
            "executive_summary": final_recommendation
        }
        
        return clean_for_json(result)
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Global Analysis Error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis pipeline failed: {str(e)}")

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