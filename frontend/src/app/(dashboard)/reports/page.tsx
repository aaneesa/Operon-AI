"use client";

import { useState, useEffect } from "react";
import { 
  FileDown, 
  FileText,  
  Loader2, 
  History,
  Check,
  AlertCircle
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


export interface DataAnalystReport {
  rows: number;
  columns: string[];
  stats: Record<string, Record<string, number>>;
  missing_values: Record<string, number>;
  anomalies: Record<string, unknown[]>;
  confidence_metric: number;
}

export interface PolicyGuardianReport {
  action: string;
  status: "compliant" | "under_review" | "non_compliant";
  relevant_policies: Array<{ content: string; metadata: Record<string, unknown> }>;
  summary: string;
}

export interface SimulationResults {
  mean: number;
  std_dev: number;
  min: number;
  max: number;
  risk_score: "Low" | "Medium" | "High";
  coefficient_of_variation: number;
  percentile_5: number;
  percentile_95: number;
}

export interface AnalysisReport {
  _id: string;
  action: string;
  timestamp: string;
  executive_summary: string;
  reports: {
    data_analyst: DataAnalystReport;
    policy_guardian: PolicyGuardianReport;
    simulation_strategist: {
      results: SimulationResults;
    };
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState<AnalysisReport[]>([]); 
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/reports`);
        if (!response.ok) throw new Error("Failed to fetch history");
        
        // Typed the response data
        const data: AnalysisReport[] = await response.json();
        setReports(data);
        if (data.length > 0) setSelectedReport(data[0]); 
      } catch (err: unknown) {
        // Fixed 'any' in catch block
        if (err instanceof Error) {
          console.error("Error loading reports:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("PDF Generation logic would trigger here using the report data.");
    }, 2000);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-black/20" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Intelligence Reports</h1>
          <p className="text-black/60 mt-2">Export autonomous findings into professional, explainable PDF documents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-black shadow-lg overflow-hidden">
            <CardHeader className="bg-black/5 border-b border-black/5 p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black italic tracking-tighter uppercase">
                    {selectedReport ? selectedReport.action : "No Report Selected"}
                  </CardTitle>
                  <p className="text-xs font-bold uppercase text-black/40 tracking-widest mt-1">
                    {selectedReport ? `ID: ${selectedReport._id.slice(-6)}` : "Select a report from history"}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {selectedReport ? (
                <>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Report Composition</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Check className="w-4 h-4 text-green-500" />
                        Risk: {selectedReport.reports.simulation_strategist.results.risk_score}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Check className="w-4 h-4 text-green-500" />
                        Confidence: {(selectedReport.reports.data_analyst.confidence_metric * 100).toFixed(1)}%
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Check className="w-4 h-4 text-green-500" />
                        Policies Cited: {selectedReport.reports.policy_guardian.relevant_policies.length}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Check className="w-4 h-4 text-green-500" />
                        Strategy synthesized by Llama-3.3
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-black/5">
                    <Button 
                      onClick={handleGenerate} 
                      disabled={isGenerating}
                      className="bg-black text-white hover:bg-black/90 h-14 px-8 rounded-full font-bold w-full sm:w-auto"
                    >
                      {isGenerating ? (
                        <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Compiling PDF...</>
                      ) : (
                        <><FileDown className="w-5 h-5 mr-3" /> Generate Final PDF Report</>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-black/40">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No historical data found. Run an analysis first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-black/5 bg-[#F9F9F9]">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black/40">
                <History className="w-4 h-4" />
                History
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-1">
                {reports.map((rpt: AnalysisReport) => (
                  <button 
                    key={rpt._id} 
                    onClick={() => setSelectedReport(rpt)}
                    className={`w-full text-left px-6 py-4 hover:bg-black/5 transition-colors border-b border-black/5 last:border-0 group ${selectedReport?._id === rpt._id ? 'bg-black/5' : ''}`}
                  >
                    <p className="text-xs font-bold text-black/40 mb-1">{rpt._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm font-bold group-hover:text-black line-clamp-1">{rpt.action}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] uppercase font-bold text-black/40 tracking-wider">
                        {new Date(rpt.timestamp).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="text-[10px] h-5 rounded-full border-black/10">
                        {rpt.reports.simulation_strategist.results.risk_score} Risk
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}