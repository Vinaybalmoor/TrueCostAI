"use client";

import { useEffect, useState } from "react";

import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Results from "./components/Results";

type ToolData = {
  name: string;
  plan: string;
  seats: string;
  monthlySpend: string;
};

type AnalysisResult = {
  totalMonthlyCost: number;
  totalAnnualCost: number;
  recommendations: string[];
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

  const handleAnalyze = () => {
    const totalMonthlyCost =
      toolDetails.reduce(
        (sum, tool) =>
          sum +
          Number(
            tool.monthlySpend || 0
          ),
        0
      );

    const totalAnnualCost =
      totalMonthlyCost * 12;

    const recommendations: string[] =
      [];

    if (
      selectedTools.includes(
        "Cursor"
      ) &&
      selectedTools.includes(
        "Copilot"
      )
    ) {
      recommendations.push(
        "Cursor and Copilot overlap for coding tasks. Consider using only one."
      );
    }

    if (
      selectedTools.includes(
        "ChatGPT"
      ) &&
      selectedTools.includes(
        "Claude"
      )
    ) {
      recommendations.push(
        "ChatGPT and Claude overlap for writing and research tasks."
      );
    }

    if (
      selectedTools.length >= 4
    ) {
      recommendations.push(
        "Multiple AI tools detected. Review subscriptions for duplicate functionality."
      );
    }

    if (
      recommendations.length === 0
    ) {
      recommendations.push(
        "Your AI stack looks reasonably optimized."
      );
    }

    const result: AnalysisResult = {
      totalMonthlyCost,
      totalAnnualCost,
      recommendations,
    };

    setAnalysisResult(result);

    localStorage.setItem(
      "analysisResults",
      JSON.stringify(result)
    );

    setShowResults(true);
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
              selectedTools={
                selectedTools
              }
              toolDetails={
                toolDetails
              }
              setToolDetails={
                setToolDetails
              }
              onBack={() =>
                setCurrentStep(2)
              }
              onAnalyze={
                handleAnalyze
              }
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