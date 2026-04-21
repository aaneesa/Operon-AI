"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileDown, 
  FileText, 
  Download, 
  Loader2, 
  History,
  ExternalLink,
  Check
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const reportHistory = [
  { id: "RPT-001", name: "Q3 Demand Forecast", date: "2026-04-20", status: "Generated" },
  { id: "RPT-002", name: "Policy Alignment Audit", date: "2026-04-18", status: "Generated" },
  { id: "RPT-003", name: "Risk Simulation: Fuel Costs", date: "2026-04-15", status: "Archived" },
];

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 3000);
  };

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
                  <CardTitle className="text-xl font-black italic tracking-tighter">OPERON EXECUTIVE SUMMARY</CardTitle>
                  <p className="text-xs font-bold uppercase text-black/40 tracking-widest mt-1">Version 1.0.4 • Stable Build</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-black/40">Report Composition</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Data Trends (Recharts)",
                    "Monte Carlo Distributions",
                    "Policy Citation Index",
                    "Executive Synthesis (CoT)"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm font-medium">
                      <Check className="w-4 h-4 text-green-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-black/5">
                {!generated ? (
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    className="bg-black text-white hover:bg-black/90 h-14 px-8 rounded-full font-bold w-full sm:w-auto"
                  >
                    {isGenerating ? (
                      <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Compiling Agent Data...</>
                    ) : (
                      <><FileDown className="w-5 h-5 mr-3" /> Generate Final PDF Report</>
                    )}
                  </Button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-green-600 text-white hover:bg-green-700 h-14 px-8 rounded-full font-bold flex-1">
                      <Download className="w-5 h-5 mr-3" />
                      Download Report
                    </Button>
                    <Button variant="outline" className="border-black h-14 px-8 rounded-full font-bold flex-1">
                      <ExternalLink className="w-5 h-5 mr-3" />
                      Open in Browser
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

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
                {reportHistory.map((rpt) => (
                  <button key={rpt.id} className="w-full text-left px-6 py-4 hover:bg-black/5 transition-colors border-b border-black/5 last:border-0 group">
                    <p className="text-xs font-bold text-black/40 mb-1">{rpt.id}</p>
                    <p className="text-sm font-bold group-hover:text-black">{rpt.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] uppercase font-bold text-black/40 tracking-wider">{rpt.date}</span>
                      <Badge variant="outline" className="text-[10px] h-5 rounded-full border-black/10">{rpt.status}</Badge>
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
