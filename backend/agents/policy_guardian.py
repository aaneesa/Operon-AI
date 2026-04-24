import os
import certifi
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Dict, Any
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_huggingface import HuggingFaceEmbeddings
from pymongo import MongoClient

class PolicyGuardian:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection_name = "policies"
        self.db_name = "operon_ai"
        self.vector_search_index_name = "vector_index"
        
        # Initialize Embeddings (matching the ingestion script)
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        # Sync client for LangChain MongoDB (LangChain MongoDB doesn't support Motor directly for vector search yet)
        self.sync_client = MongoClient(os.getenv("DATABASE_URL"))
        self.collection = self.sync_client[self.db_name][self.collection_name]
        
        self.vector_search = MongoDBAtlasVectorSearch(
            collection=self.collection,
            embedding=self.embeddings,
            index_name=self.vector_search_index_name
        )

    async def check_compliance(self, proposed_action: str) -> Dict[str, Any]:
        """
        Queries the vector database of company documents to ensure alignment with governance.
        """
        try:
            relevant_docs = self.vector_search.similarity_search(proposed_action, k=3)
        except Exception as e:
            print(f"Vector search failed (check if index is created): {e}")
            relevant_docs = []
        
        relevant_policies = [
            {"content": doc.page_content, "metadata": doc.metadata} 
            for doc in relevant_docs
        ]
        
        status = "compliant" if relevant_policies else "under_review"
        
        compliance_report = {
            "action": proposed_action,
            "status": status,
            "relevant_policies": relevant_policies,
            "summary": "Action aligns with the following policies." if relevant_policies else "No specific policy found or index missing. Requires manual review."
        }
        return compliance_report
