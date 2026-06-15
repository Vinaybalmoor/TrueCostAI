import CostChart from "./CostChart";
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
  const totalSpend = analysisResult.totalMonthlyCost;
  const annualSpend = analysisResult.totalAnnualCost;

  const monthlySavings = totalSpend * 0.2;
  const annualSavings = monthlySavings * 12;

  const wastePercentage = 20;
  const optimizationScore = 100 - wastePercentage;

  return (
    <div
  className="
    bg-slate-900
    p-10
    rounded-2xl
    shadow-2xl
    border
    border-slate-700
    max-w-6xl
    w-full
  "
>
      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-white mb-2">
        TRUECOST AI REPORT
      </h1>

      <p className="text-center text-slate-400 mb-10">
        AI Subscription Cost Optimization Dashboard
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl text-center">
          <h2 className="text-slate-400 font-semibold">
            Monthly Spend
          </h2>

          <p className="text-3xl font-bold text-white mt-2">
            ${totalSpend.toFixed(2)}
          </p>
        </div>
{/* Cost Breakdown Chart */} 
<CostChart toolDetails={toolDetails} />
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl text-center">
          <h2 className="text-slate-400 font-semibold">
            Annual Spend
          </h2>

          <p className="text-3xl font-bold text-white mt-2">
            ${annualSpend.toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl text-center">
          <h2 className="text-slate-400 font-semibold">
            Potential Savings
          </h2>

          <p className="text-3xl font-bold text-green-400 mt-2">
            ${annualSavings.toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl text-center">
          <h2 className="text-slate-400 font-semibold">
            Waste %
          </h2>

          <p className="text-3xl font-bold text-yellow-400 mt-2">
            {wastePercentage}%
          </p>
        </div>
      </div>

      {/* Optimization Score */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Optimization Score
        </h2>

        <div className="w-full bg-slate-700 rounded-full h-4">
          <div
            className="bg-violet-500 h-4 rounded-full"
            style={{
              width: `${optimizationScore}%`,
            }}
          />
        </div>

        <p className="text-white mt-3 font-semibold">
          {optimizationScore}/100
        </p>
      </div>

      {/* Company Summary */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Company Summary
        </h2>

        <div className="space-y-2 text-slate-300">
          <p>
            Team Size:
            <span className="text-white font-semibold ml-2">
              {teamSize}
            </span>
          </p>

          <p>
            Primary Use Case:
            <span className="text-white font-semibold ml-2 capitalize">
              {primaryUseCase}
            </span>
          </p>

          <p>
            Selected Tools:
            <span className="text-white font-semibold ml-2">
              {selectedTools.join(", ")}
            </span>
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          AI Recommendations
        </h2>

        <ul className="space-y-3">
          {analysisResult.recommendations.map(
            (item, index) => (
              <li
                key={index}
                className="bg-green-900/20 border border-green-700 text-green-300 p-4 rounded-xl"
              >
                ✓ {item}
              </li>
            )
          )}

          <li className="bg-violet-900/20 border border-violet-700 text-violet-300 p-4 rounded-xl">
            Estimated Annual Savings:
            ${annualSavings.toFixed(2)}
          </li>
        </ul>
      </div>

      {/* Tool Breakdown */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8 overflow-x-auto">
        <h2 className="text-xl font-bold text-white mb-4">
          Tool Breakdown
        </h2>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-700 text-white">
              <th className="p-3 text-left">Tool</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Seats</th>
              <th className="p-3 text-left">
                Monthly Spend
              </th>
              <th className="p-3 text-left">
                Annual Cost
              </th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {toolDetails.map((tool) => {
              const spend = Number(
                tool.monthlySpend
              );

              const annualCost = spend * 12;

              let status = (
                <span className="text-green-400">
                  Healthy
                </span>
              );

              if (spend > totalSpend * 0.4) {
                status = (
                  <span className="text-red-400">
                    Optimize
                  </span>
                );
              } else if (
                spend > totalSpend * 0.2
              ) {
                status = (
                  <span className="text-yellow-400">
                    Review
                  </span>
                );
              }

              return (
                <tr
                  key={tool.name}
                  className="border-b border-slate-700 text-slate-300"
                >
                  <td className="p-3">
                    {tool.name}
                  </td>

                  <td className="p-3">
                    {tool.plan}
                  </td>

                  <td className="p-3">
                    {tool.seats}
                  </td>
                  

          
<td className="p-3">
  ${spend.toFixed(2)}
</td>

<td className="p-3">
  ${annualCost.toLocaleString()}
</td>



                  <td className="p-3 font-semibold">
                    {status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Executive Insight */}
      <div className="bg-violet-900/20 border border-violet-700 p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Executive Insight
        </h2>

        <p className="text-slate-300 leading-relaxed">
          TRUECOST AI analyzed{" "}
          <span className="font-bold text-white">
            {selectedTools.length}
          </span>{" "}
          AI tools currently used by your team.

          Your organization spends approximately{" "}
          <span className="font-bold text-white">
            ${annualSpend.toLocaleString()}
          </span>{" "}
          annually on AI subscriptions.

          By optimizing overlapping tools and
          reducing unnecessary spending, the
          estimated savings could reach{" "}
          <span className="font-bold text-green-400">
            ${annualSavings.toLocaleString()}
          </span>{" "}
          per year.
        </p>
      </div>

      {/* Restart */}
      <div className="text-center">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="
            bg-violet-600
            hover:bg-violet-700
            text-white
            px-8
            py-3
            rounded-xl
            font-semibold
            transition
          "
        >
          Start New Analysis
        </button>
      </div>
    </div>
  );
}
