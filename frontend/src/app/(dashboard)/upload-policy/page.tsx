"use client";

import { useState } from "react";
import { FileText, Search, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function UploadPolicyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isIndexing, setIsIndexing] = useState(false);
  const [isIndexed, setIsIndexed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setIsIndexing(true);
    setError(null);

    // Prepare Multipart Form Data for the FastAPI backend
    const formData = new FormData();
    formData.append("file", file); // Key must match the backend parameter name

    try {
      const response = await fetch(`${API_BASE_URL}/upload-policy`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to index document");
      }

      const result = await response.json();
      console.log("Indexing Result:", result);
      setIsIndexed(true);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsIndexing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Policy Governance</h1>
        <p className="text-black/60 mt-2">Ingest legal and operational manuals into the Policy Guardian vector database.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-black shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest">Document Ingestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!file ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-black/10 rounded-2xl p-12 cursor-pointer hover:bg-black/5 transition-colors">
                <FileText className="w-10 h-10 text-black/20 mb-4" />
                <p className="text-sm font-bold text-center">Select Policy PDF</p>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-black/5 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-black/5">
                    <FileText className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{file.name}</p>
                    <p className="text-xs text-black/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                {/* Error Message Display */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-800 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}
                
                {!isIndexed ? (
                  <Button 
                    onClick={handleUpload} 
                    disabled={isIndexing}
                    className="w-full bg-black text-white hover:bg-black/90 h-12"
                  >
                    {isIndexing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Indexing Documents...</>
                    ) : (
                      "Start Vector Indexing"
                    )}
                  </Button>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-bold text-green-800">Document Indexed Successfully</p>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => { setFile(null); setIsIndexed(false); setError(null); }}
                  className="w-full border-black/10 text-black/40 hover:text-black hover:bg-transparent"
                >
                  Clear Selection
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-black/5 bg-white min-h-125">
            <CardHeader className="border-b border-black/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest">Extracted Text Preview</CardTitle>
                {isIndexed && <Badge className="bg-green-500 hover:bg-green-600 text-white border-none">Indexed</Badge>}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-112.5 p-8">
                {file ? (
                  <div className="space-y-6 text-sm leading-relaxed text-black/70">
                    <h2 className="text-xl font-bold text-black uppercase tracking-tighter">
                      {isIndexed ? "PROCESSING COMPLETE" : "PREPARING DOCUMENT..."}
                    </h2>
                    <p className="italic text-black/40">
                      The document {file.name} is being parsed into chunks for vector search. Once indexed, the Policy Guardian agent will use this data for compliance checks.
                    </p>
                    <div className="border-l-2 border-black/5 pl-4 space-y-4">
                      <p><strong>Status:</strong> {isIndexed ? "Vector Chunks Stored" : "Pending Analysis"}</p>
                      <p><strong>Target DB:</strong> operon_ai.policies</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-black/20 pt-20">
                    <Search className="w-12 h-12 mb-4" />
                    <p className="text-sm font-medium">Upload a document to see preview</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}