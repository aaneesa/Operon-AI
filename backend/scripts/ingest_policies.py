import os
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

# Configuration
MONGODB_ATLAS_CLUSTER_URI = os.getenv("DATABASE_URL")
DB_NAME = "operon_ai"
COLLECTION_NAME = "policies"
VECTOR_SEARCH_INDEX_NAME = "vector_index"

def ingest_pdfs(directory_path: str):
    # 1. Initialize MongoDB Client
    client = MongoClient(MONGODB_ATLAS_CLUSTER_URI)
    collection = client[DB_NAME][COLLECTION_NAME]

    # 2. Initialize Embeddings Model
    # Using a local HuggingFace model for speed and cost
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # 3. Load PDFs
    documents = []
    for filename in os.listdir(directory_path):
        if filename.endswith(".pdf"):
            file_path = os.path.join(directory_path, filename)
            print(f"Processing {filename}...")
            loader = PyPDFLoader(file_path)
            documents.extend(loader.load())

    if not documents:
        print("No PDF documents found.")
        return

    # 4. Split Documents into Chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_documents(documents)

    # 5. Store in MongoDB Atlas Vector Search
    vector_search = MongoDBAtlasVectorSearch.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection=collection,
        index_name=VECTOR_SEARCH_INDEX_NAME
    )

    print(f"Successfully ingested {len(chunks)} chunks into MongoDB Atlas.")


if __name__ == "__main__":
    PDF_DIR = "./data/policies"
    if not os.path.exists(PDF_DIR):
        os.makedirs(PDF_DIR)
    ingest_pdfs(PDF_DIR)
