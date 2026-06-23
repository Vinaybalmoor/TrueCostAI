"use client";

import { useEffect, useState } from "react";

import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Results from "./components/Results";

export type ReceiptItem = {
  tool: string;
  action: string;
  savings: number;
  reason: string;
};

// Update this existing type
export type AnalysisResult = {
  totalMonthlyCost: number;
  totalAnnualCost: number;
  receipt: ReceiptItem[]; // Changed from recommendations: string[]
};
export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);

  const [teamSize, setTeamSize] = useState("");
  const [primaryUseCase, setPrimaryUseCase] = useState("");

  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [toolDetails, setToolDetails] = useState<ToolData[]>([]);

  const [showResults, setShowResults] = useState(false);

  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);

  useEffect(() => {
    const savedData =
      localStorage.getItem("truecost-data");

    if (savedData) {
      const parsed = JSON.parse(savedData);

      setTeamSize(parsed.teamSize || "");
      setPrimaryUseCase(
        parsed.primaryUseCase || ""
      );

      setSelectedTools(
        parsed.selectedTools || []
      );

      setToolDetails(
        parsed.toolDetails || []
      );
    }

    // Add this new type


    const savedAnalysis =
      localStorage.getItem(
        "analysisResults"
      );

    if (savedAnalysis) {
      setAnalysisResult(
        JSON.parse(savedAnalysis)
      );
    }
  }, []);

  useEffect(() => {
    const formData = {
      teamSize,
      primaryUseCase,
      selectedTools,
      toolDetails,
    };

    localStorage.setItem(
      "truecost-data",
      JSON.stringify(formData)
    );
  }, [
    teamSize,
    primaryUseCase,
    selectedTools,
    toolDetails,
  ]);

  const handleAnalyze = async () => {
    try {
      const getNumericTeamSize = (sizeStr: string) => {
      if (sizeStr === "1-5") return 5;
      if (sizeStr === "6-20") return 20;
      if (sizeStr === "21-50") return 50;
      if (sizeStr === "51-100") return 100;
      if (sizeStr === "100+") return 200;
      return 0;
    };
      // 1. Format the data to match exactly what your Node.js backend expects
      const payload = {
        teamSize: getNumericTeamSize(teamSize),
        primaryUseCase: primaryUseCase,
        tools: toolDetails.map((tool) => ({
          name: tool.name,
          plan: tool.plan.toLowerCase(), // Ensure this matches PRICING_DATA.json keys
          seats: Number(tool.seats || 0),
          monthlySpend: Number(tool.monthlySpend || 0),
        })),
      };

      // 2. Call the TrueCost API (Ensure your backend is running on port 5000!)
      const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/audit`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }
);

      const result = await response.json();

      if (result.success) {
        // 3. Map the backend response into the shape the Results component expects
        const finalResult: AnalysisResult = {
          totalMonthlyCost: result.heroMetrics.totalMonthlyWaste,
          totalAnnualCost: result.heroMetrics.totalAnnualSavings,
          // Extract the specific reasons from the backend receipt array
         receipt: result.receipt,
        };

        setAnalysisResult(finalResult);

        // Save to local storage and show results
        localStorage.setItem("analysisResults", JSON.stringify(finalResult));
        setShowResults(true);
      } else {
        alert("Audit failed: " + result.message);
      }
    } catch (error) {
      console.error("Failed to connect to backend:", error);
      alert("Could not connect to the backend API. Is the server running?");
    }
  };

  const progress =
    currentStep === 1
      ? 33
      : currentStep === 2
      ? 66
      : 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-5xl">

        {!showResults && (
          <div className="mb-8">
            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div
                className="bg-black h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p className="text-center text-gray-600 mt-2">
              Step {currentStep} of 3
            </p>
          </div>
        )}

        {currentStep === 1 &&
          !showResults && (
            <Step1
              teamSize={teamSize}
              setTeamSize={
                setTeamSize
              }
              primaryUseCase={
                primaryUseCase
              }
              setPrimaryUseCase={
                setPrimaryUseCase
              }
              onNext={() =>
                setCurrentStep(2)
              }
            />
          )}

        {currentStep === 2 &&
          !showResults && (
            <Step2
              selectedTools={
                selectedTools
              }
              setSelectedTools={
                setSelectedTools
              }
              onBack={() =>
                setCurrentStep(1)
              }
              onNext={() =>
                setCurrentStep(3)
              }
            />
          )}

        {currentStep === 3 &&
          !showResults && (
            <Step3
              selectedTools={selectedTools}
              // FIX: This prop was duplicated and had the wrong value
              toolDetails={toolDetails} 
              setToolDetails={setToolDetails}
              onBack={() => setCurrentStep(2)}
              onAnalyze={handleAnalyze}
            />
          )}

        {showResults &&
          analysisResult && (
            <Results
              teamSize={teamSize}
              primaryUseCase={
                primaryUseCase
              }
              selectedTools={
                selectedTools
              }
              toolDetails={
                toolDetails
              }
              analysisResult={
                analysisResult
              }
            />
          )}
      </div>
    </main>
  );
}