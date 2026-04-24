"use client";

import { motion } from "framer-motion";
import { 
  BrainCircuit, 
  Target, 
  ShieldCheck, 
  ArrowRight,
  Info,
  ChevronRight,
  Lightbulb
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/AnalysisContext";

export default function InsightsPage() {
  const { analysisResult } = useAnalysis();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">AI Insights Hive</h1>
          <p className="text-black/60 mt-2">Autonomous synthesis from specialized agent personalities.</p>
        </div>
        <Badge variant="outline" className="px-4 py-1 border-black bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest">
          Analysis Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agent Findings Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-4 px-2">Agent Feed</h3>
          
          {[
            { name: "Data Analyst", status: "Completed", icon: Target },
            { name: "Policy Guardian", status: "Verified", icon: ShieldCheck },
            { name: "Simulation Strategist", status: "Iterating", icon: BrainCircuit },
          ].map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 bg-white border border-black/5 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                  <agent.icon className="w-4 h-4 text-black" />
                </div>
                <span className="text-sm font-bold">{agent.name}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-black/20" />
            </motion.div>
          ))}
        </div>

        {/* Main Insight Engine */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-black shadow-2xl bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-black" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Chain-of-Thought Synthesis</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={`${
                      analysisResult?.reports?.simulation_strategist?.results?.risk_score === "High" ? "bg-red-100 text-red-800" :
                      analysisResult?.reports?.simulation_strategist?.results?.risk_score === "Medium" ? "bg-orange-100 text-orange-800" :
                      "bg-green-100 text-green-800"
                    } border-none rounded-sm px-3`}>
                      Risk: {analysisResult?.reports?.simulation_strategist?.results?.risk_score || "N/A"}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 border-none rounded-sm px-3">
                      Compliance: {analysisResult?.reports?.policy_guardian?.status === "compliant" ? "Verified" : "Under Review"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase text-black/40 tracking-widest">
                      <Info className="w-4 h-4" />
                      Prediction
                    </div>
                    <div className="p-4 bg-[#F9F9F9] rounded-lg border border-black/5">
                      <p className="text-3xl font-black">
                        {analysisResult?.reports?.data_analyst?.stats?.revenue?.mean 
                          ? `+${(analysisResult.reports.data_analyst.stats.revenue.mean / 1000).toFixed(1)}%` 
                          : "+0.0%"}
                      </p>
                      <p className="text-sm text-black/60 mt-1">Expected Demand Surge</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase text-black/40 tracking-widest">
                      <Target className="w-4 h-4" />
                      Confidence
                    </div>
                    <div className="p-4 bg-[#F9F9F9] rounded-lg border border-black/5">
                      <p className="text-3xl font-black">
                        {analysisResult?.reports?.data_analyst?.confidence_metric 
                          ? `${(analysisResult.reports.data_analyst.confidence_metric * 100).toFixed(1)}%` 
                          : "0.0%"}
                      </p>
                      <p className="text-sm text-black/60 mt-1">Mathematical Predictability</p>
                    </div>
                  </div>
                </div>

                <hr className="border-black/5" />

                {/* Final Recommendation */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase text-black/40 tracking-widest">
                    <Lightbulb className="w-4 h-4" />
                    Strategic Recommendation
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold leading-relaxed">
                      {analysisResult?.executive_summary || "No analysis data available. Please upload a dataset to generate insights."}
                    </h2>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button className="bg-black text-white hover:bg-black/90 h-12 px-8 rounded-full font-bold">
                      Execute Recommendation
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="border-black/10 hover:bg-black/5 h-12 px-8 rounded-full font-bold">
                      View CoT Breakdown
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
