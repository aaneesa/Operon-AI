"use client";
import React, { createContext, useContext, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// --- Interface Definitions ---

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

export interface SimulationStrategistReport {
  scenario: string;
  impact_assessment: string;
  results: SimulationResults;
}

export interface AnalysisResult {
  reports: {
    data_analyst: DataAnalystReport;
    policy_guardian: PolicyGuardianReport;
    simulation_strategist: SimulationStrategistReport;
  };
  executive_summary: string;
}

interface AnalysisContextType {
  analysisResult: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  runAnalysis: (proposedAction: string, csvData: Record<string, unknown>[]) => Promise<void>;
}

// --- Context Implementation ---

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (proposedAction: string, csvData: Record<string, unknown>[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposed_action: proposedAction,
          csv_data: csvData,
          base_impact: 100.0 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed');
      }
      
      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnalysisContext.Provider value={{ analysisResult, loading, error, runAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error('useAnalysis must be used within an AnalysisProvider');
  return context;
};