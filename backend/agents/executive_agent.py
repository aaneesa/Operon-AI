from groq import Groq
import os
from typing import Dict, Any

class ExecutiveDecisionAgent:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    async def synthesize_findings(self, data_analyst_report: Dict[str, Any], 
                                 policy_guardian_report: Dict[str, Any], 
                                 simulation_strategist_report: Dict[str, Any]) -> str:
        """
        Synthesizes findings from all agents into a cohesive recommendation using GROQ.
        """
        prompt = f"""
        As the Executive Decision Agent for Operon AI, your task is to synthesize reports from three specialized agents:
        
        1. Data Analyst Report: {data_analyst_report}
        2. Policy Guardian Report: {policy_guardian_report}
        3. Simulation Strategist Report: {simulation_strategist_report}
        
        Provide a final, "explainable" recommendation with a clear Chain-of-Thought (CoT) breakdown.
        
        The response MUST include:
        1. Risk Score: (Low/Med/High) based on simulation variance in the Strategist Report.
        2. Policy Citations: Direct quotes or summaries from the Policy Guardian findings justifying the decision.
        3. Confidence Metrics: Mathematical certainty derived from the Data Analyst's confidence_metric.
        4. Strategic Recommendation: Cohesive advice based on all inputs.
        5. "Why this action?": A detailed explainability section.
        """
        
        completion = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are the Executive Decision Agent of Operon AI, designed to provide cohesive, explainable corporate strategy based on agent data."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2048
        )
        
        return completion.choices[0].message.content
