import numpy as np
from typing import Dict, Any, List

class SimulationStrategist:
    def __init__(self):
        pass

    def run_monte_carlo(self, base_value: float, variance: float, iterations: int = 1000) -> Dict[str, Any]:
        """
        Performs a Monte Carlo simulation for a given base value and variance.
        Example: Impact of fuel cost rise on delivery margin.
        """
        # Simulate normal distribution of outcomes
        simulated_outcomes = np.random.normal(base_value, base_value * variance, iterations)
        std_dev = np.std(simulated_outcomes)
        mean = np.mean(simulated_outcomes)
        
        # Risk Score Logic: Coefficient of Variation
        cv = std_dev / mean if mean != 0 else 1.0
        risk_score = "Low" if cv < 0.1 else "Medium" if cv < 0.25 else "High"
        
        results = {
            "mean": float(mean),
            "std_dev": float(std_dev),
            "min": float(np.min(simulated_outcomes)),
            "max": float(np.max(simulated_outcomes)),
            "risk_score": risk_score,
            "coefficient_of_variation": float(cv),
            "percentile_5": float(np.percentile(simulated_outcomes, 5)),
            "percentile_95": float(np.percentile(simulated_outcomes, 95))
        }
        return results

    def simulate_what_if(self, scenario: str, variables: Dict[str, float]) -> Dict[str, Any]:
        """
        Runs a "What-If" scenario based on provided variables.
        """
        # Logic to parse scenario and apply to variables
        # For now, just a placeholder summary
        return {
            "scenario": scenario,
            "impact_assessment": "Simulated impact shows a potential shift in margins.",
            "results": self.run_monte_carlo(sum(variables.values()), 0.1)
        }
