import pandas as pd
import numpy as np
from typing import Dict, Any

class DataAnalyst:
    def __init__(self):
        pass

    def analyze_data(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Performs exploratory data analysis (EDA) and detects anomalies.
        """
        anomalies = self._detect_anomalies(df)
        total_data_points = len(df) * len(df.columns)
        anomaly_count = sum(len(v) for v in anomalies.values())
        confidence = max(0, 1 - (anomaly_count / total_data_points)) if total_data_points > 0 else 1.0

        summary = {
            "rows": len(df),
            "columns": list(df.columns),
            "stats": df.describe().to_dict(),
            "missing_values": df.isnull().sum().to_dict(),
            "anomalies": anomalies,
            "confidence_metric": float(confidence)
        }
        return summary

    def _detect_anomalies(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Simple anomaly detection using Z-score for numerical columns.
        """
        anomalies = {}
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            z_scores = (df[col] - df[col].mean()) / df[col].std()
            outliers = df[z_scores.abs() > 3]
            if not outliers.empty:
                anomalies[col] = outliers.to_dict(orient="records")
        return anomalies

    def forecast_trends(self, df: pd.DataFrame, target_col: str) -> Dict[str, Any]:
        """
        Generates a simple trend forecast.
        """
        if target_col in df.columns:
            trend = "increasing" if df[target_col].iloc[-1] > df[target_col].iloc[0] else "decreasing"
            return {"trend": trend, "last_value": df[target_col].iloc[-1]}
        return {"error": f"Column {target_col} not found"}
