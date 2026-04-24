"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

import { useAnalysis } from "@/context/AnalysisContext";

export default function DashboardPage() {
  const { analysisResult } = useAnalysis();

  // Mapping real data from AnalysisContext
  const kpiData = [
    { 
      title: "Predicted Demand", 
      value: analysisResult?.reports?.data_analyst?.stats?.revenue?.mean 
        ? `+${(analysisResult.reports.data_analyst.stats.revenue.mean / 1000).toFixed(1)}%` 
        : analysisResult?.reports?.data_analyst?.stats 
          ? `+${Object.values(analysisResult.reports.data_analyst.stats)[0]?.mean?.toFixed(1) || "0.0"}%`
          : "+18.4%", 
      trend: "up", 
      description: "Derived from Data Analyst",
      icon: TrendingUp,
    },
    { 
      title: "Risk Level", 
      value: analysisResult?.reports?.simulation_strategist?.results?.risk_score || "Medium", 
      trend: "down", 
      description: "Monte Carlo Simulation",
      icon: AlertTriangle,
    },
    { 
      title: "Confidence Score", 
      value: analysisResult?.reports?.data_analyst?.confidence_metric 
        ? `${(analysisResult.reports.data_analyst.confidence_metric * 100).toFixed(0)}%` 
        : "94%", 
      trend: "up", 
      description: "Statistical Consistency",
      icon: CheckCircle,
    },
  ];

  // Dynamic trend data from analysisResult stats
  const trendData = analysisResult?.reports?.data_analyst?.stats
    ? Object.entries(analysisResult.reports.data_analyst.stats).slice(0, 7).map(([name, stats]: [string, any]) => ({
        name,
        value: stats.mean || 0
      }))
    : [
        { name: "Jan", value: 400 },
        { name: "Feb", value: 300 },
        { name: "Mar", value: 600 },
        { name: "Apr", value: 800 },
        { name: "May", value: 500 },
        { name: "Jun", value: 900 },
        { name: "Jul", value: 1100 },
      ];

  // Dynamic category data from anomalies
  const categoryData = analysisResult?.reports?.data_analyst?.anomalies && Object.keys(analysisResult.reports.data_analyst.anomalies).length > 0
    ? Object.entries(analysisResult.reports.data_analyst.anomalies).map(([name, items]: [string, any]) => ({
        name,
        value: Array.isArray(items) ? items.length : 0
      }))
    : [
        { name: "Legal", value: 400 },
        { name: "Ops", value: 300 },
        { name: "Finance", value: 200 },
        { name: "HR", value: 100 },
      ];

  const COLORS = ["#000000", "#333333", "#666666", "#999999"];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-black/60 mt-2">Real-time overview of corporate digital twin logic.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-black/40">Status</p>
          <p className="text-sm font-bold uppercase">{analysisResult ? "Recently Updated" : "Awaiting Data"}</p>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-black/5 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-black/60">{kpi.title}</CardTitle>
                <kpi.icon className="w-4 h-4 text-black/40" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-500" />
                  )}
                  <p className="text-xs text-black/40">{kpi.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-black/5 h-[400px]">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Statistical Mean Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #f0f0f0' }}
                    itemStyle={{ color: '#000' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#000" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#000' }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-black/5 h-[400px]">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Anomaly Detection Count</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f9f9f9' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #f0f0f0' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
