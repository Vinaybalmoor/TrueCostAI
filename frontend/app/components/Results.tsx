"use client";

import { useState } from "react";
import CostChart from "./CostChart";
import { ReceiptItem } from "../page";

type ToolData = {
  name: string;
  plan: string;
  seats: string;
  monthlySpend: string;
};

type AnalysisResult = {
  totalMonthlyCost: number;
  totalAnnualCost: number;
  receipt: ReceiptItem[];
};

type ResultsProps = {
  teamSize: string;
  primaryUseCase: string;
  selectedTools: string[];
  toolDetails: ToolData[];
  analysisResult: AnalysisResult;
};

export default function Results({
  teamSize,
  primaryUseCase,
  selectedTools,
  toolDetails,
  analysisResult,
}: ResultsProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSpend = analysisResult.totalMonthlyCost;
  const annualSavings = analysisResult.totalAnnualCost;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    try {
      const payload = {
        email,
        teamSize: Number(teamSize),
        primaryUseCase,
        tools: toolDetails,
      };

      // Call your backend; the backend detects the email and triggers MongoDB + Nodemailer
      await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setIsUnlocked(true);
    } catch (error) {
      console.error("Failed to unlock:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-700 max-w-6xl w-full">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        Your AI Spend Audit
      </h1>

      {/* Metrics - Always visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 font-medium mb-2">Total Monthly Waste</p>
          <p className="text-5xl font-bold text-red-400">
            ${totalSpend.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 font-medium mb-2">
            Potential Annual Savings
          </p>
          <p className="text-5xl font-bold text-green-400">
            ${annualSavings.toLocaleString()}
          </p>
        </div>
      </div>

      <CostChart toolDetails={toolDetails} />

      {/* BLURRED RECOMMENDATIONS SECTION */}
      <div className="relative">
        <h2 className="text-2xl font-bold text-white mb-6">
          Itemized Recommendations
        </h2>

        <div
          className={`transition-all duration-700 ${!isUnlocked ? "blur-md select-none opacity-50 pointer-events-none" : ""}`}
        >
          <div className="space-y-4">
            {analysisResult.receipt.map((item, index) => (
              <div
                key={index}
                className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-2">
                  <h3 className="text-xl font-bold text-white capitalize">
                    {item.tool}
                  </h3>
                  <span className="text-green-400 font-bold bg-green-900/30 px-3 py-1 rounded-full text-sm">
                    Save ${item.savings}/mo
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider
                      ${
                        item.action.includes("CANCEL")
                          ? "bg-red-900/50 text-red-400 border border-red-700"
                          : item.action.includes("DOWNGRADE")
                            ? "bg-yellow-900/50 text-yellow-400 border border-yellow-700"
                            : "bg-blue-900/50 text-blue-400 border border-blue-700"
                      }`}
                  >
                    {item.action}
                  </span>
                </div>
                <p className="text-slate-300 text-lg mt-2">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The Soft Gate Overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <form
              onSubmit={handleUnlock}
              className="bg-slate-950 p-8 rounded-2xl border border-violet-500 shadow-2xl text-center max-w-sm w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Unlock Full Audit
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Enter your work email to see the itemized breakdown and savings
                plan.
              </p>
              <input
                type="email"
                required
                placeholder="name@company.com"
                className="w-full p-3 rounded mb-4 bg-slate-800 text-white border border-slate-600 focus:ring-2 focus:ring-violet-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                disabled={isSubmitting}
                className="w-full bg-violet-600 p-3 rounded text-white font-bold hover:bg-violet-700 transition"
              >
                {isSubmitting ? "Unlocking..." : "Unlock Insights"}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="text-center mt-16">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="text-slate-400 hover:text-white transition"
        >
          Start New Audit
        </button>
      </div>
    </div>
  );
}
