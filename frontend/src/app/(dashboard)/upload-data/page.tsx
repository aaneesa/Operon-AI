"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, X, Check } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UploadDataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const { setAnalysisResult, setIsLoading, isLoading } = useAnalysis();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split("\n").filter(line => line.trim()).map(line => line.split(","));
        if (rows.length > 0) {
          const header = rows[0].map(h => h.trim());
          const data = rows.slice(1, 11).map(row => {
            const obj: any = {};
            header.forEach((h, i) => obj[h] = row[i]?.trim());
            return obj;
          });
          setColumns(header);
          setPreview(data);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsLoading(true);

    try {
      const text = await file.text();
      const rows = text.split("\n").filter(line => line.trim()).map(line => line.split(","));
      const header = rows[0].map(h => h.trim());
      const fullData = rows.slice(1).map(row => {
        const obj: any = {};
        header.forEach((h, i) => obj[h] = row[i]?.trim());
        return obj;
      });

      const response = await axios.post("http://localhost:8000/analyze", {
        csv_data: fullData,
        proposed_action: "Analyze this dataset for trends and anomalies"
      });

      setAnalysisResult(response.data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to process data. Ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview([]);
    setColumns([]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Data Ingestion</h1>
        <p className="text-black/60 mt-2">Upload datasets (CSV/JSON) for EDA and anomaly detection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-black/5 border-dashed border-2 bg-transparent h-fit">
          <CardContent className="p-8">
            {!file ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-black/40" />
                </div>
                <div>
                  <p className="text-sm font-bold">Click or drag to upload CSV</p>
                  <p className="text-xs text-black/40 mt-1">Maximum file size 50MB</p>
                </div>
                <label className="cursor-pointer">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".csv,.json" 
                    onChange={handleFileChange} 
                  />
                  <Button variant="outline" className="mt-2 border-black/10 hover:bg-black/5">
                    Select File
                  </Button>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-black" />
                    <div>
                      <p className="text-sm font-bold truncate max-w-[150px]">{file.name}</p>
                      <p className="text-xs text-black/40">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button onClick={removeFile} className="text-black/40 hover:text-black">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <Button 
                  className="w-full bg-black text-white hover:bg-black/90"
                  onClick={handleProcess}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Process Dataset"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-black/5 shadow-sm overflow-hidden">
                <CardHeader className="bg-black/5 border-b border-black/5 flex flex-row items-center justify-between py-4">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Preview: First 10 Rows
                  </CardTitle>
                  <p className="text-xs text-black/40">{columns.length} columns detected</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-black/5">
                          {columns.map((col) => (
                            <TableHead key={col} className="text-xs font-bold uppercase text-black/40 py-4">
                              {col}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {preview.map((row, i) => (
                          <TableRow key={i} className="border-black/5">
                            {columns.map((col) => (
                              <TableCell key={col} className="text-sm py-3 font-medium">
                                {row[col]}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
