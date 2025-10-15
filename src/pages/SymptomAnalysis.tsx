import React from "react";
import { useNavigate } from "react-router-dom";

const SymptomAnalysis = () => {
  const navigate = useNavigate();

  const handleStartCheck = () => {
    navigate('/chatbot');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="max-w-xl w-full bg-card rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-primary">Symptom Analysis</h1>
        <p className="text-lg text-muted-foreground mb-6">
          AI-powered analysis of your symptoms with personalized insights and recommendations.
        </p>
        <ul className="space-y-4 mb-8">
          <li className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-medical-blue"></span>
            <span className="font-medium">Smart symptom checker</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-medical-blue"></span>
            <span className="font-medium">Risk assessment</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-medical-blue"></span>
            <span className="font-medium">Treatment suggestions</span>
          </li>
        </ul>
        <div className="text-center">
          <button className="bg-medical-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary transition-colors" onClick={handleStartCheck}>
            Start Symptom Check
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomAnalysis;
