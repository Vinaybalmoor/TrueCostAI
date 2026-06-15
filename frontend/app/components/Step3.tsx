
type ToolData = {
  name: string;
  plan: string;
  seats: string;
  monthlySpend: string;
};

type Step3Props = {
  selectedTools: string[];
  toolDetails: ToolData[];
  setToolDetails: (data: ToolData[]) => void;
  onBack: () => void;
  onAnalyze: () => void;
};

export default function Step3({
  selectedTools,
  toolDetails,
  setToolDetails,
  onBack,
  onAnalyze,
}: Step3Props) {
  const handleChange = (
    toolName: string,
    field: keyof ToolData,
    value: string
  ) => {
    const updated = [...toolDetails];

    const index = updated.findIndex(
      (tool) => tool.name === toolName
    );

    if (index !== -1) {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    } else {
      updated.push({
        name: toolName,
        plan: "",
        seats: "",
        monthlySpend: "",
        [field]: value,
      });
    }

    setToolDetails(updated);
  };

  const isValid = selectedTools.every((tool) => {
    const data = toolDetails.find((t) => t.name === tool);

    return !!(
      data?.plan &&
      data?.seats &&
      data?.monthlySpend
    );
  });

  return (
    <div className="bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-700 w-[900px]">
      <h1 className="text-4xl font-bold text-center mb-2 text-white">
        Tool Configuration
      </h1>

      <p className="text-center text-slate-400 mb-8">
        Enter subscription details for each selected AI tool
      </p>

      {selectedTools.map((tool) => {
        const toolInfo = toolDetails.find(
          (t) => t.name === tool
        );

        const annualCost =
          Number(toolInfo?.monthlySpend || 0) * 12;

        return (
          <div
            key={tool}
            className="
              bg-slate-800
              border
              border-slate-700
              rounded-2xl
              p-6
              mb-6
            "
          >
            <h2 className="text-xl font-bold text-white mb-4">
              {tool}
            </h2>

            <select
              value={toolInfo?.plan || ""}
              onChange={(e) =>
                handleChange(
                  tool,
                  "plan",
                  e.target.value
                )
              }
              className="
                w-full
                p-3
                rounded-xl
                bg-slate-700
                text-white
                border
                border-slate-600
                mb-3
                focus:outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            >
              <option value="">Select Plan</option>
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Team">Team</option>
              <option value="Enterprise">
                Enterprise
              </option>
            </select>

            <input
              type="number"
              placeholder="Number of Seats"
              value={toolInfo?.seats || ""}
              onChange={(e) =>
                handleChange(
                  tool,
                  "seats",
                  e.target.value
                )
              }
              className="
                w-full
                p-3
                rounded-xl
                bg-slate-700
                text-white
                border
                border-slate-600
                mb-3
                focus:outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />

            <input
              type="number"
              placeholder="Monthly Spend ($)"
              value={toolInfo?.monthlySpend || ""}
              onChange={(e) =>
                handleChange(
                  tool,
                  "monthlySpend",
                  e.target.value
                )
              }
              className="
                w-full
                p-3
                rounded-xl
                bg-slate-700
                text-white
                border
                border-slate-600
                focus:outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />

            <div className="mt-4 bg-violet-900/30 border border-violet-700 rounded-xl p-4">
              <p className="text-violet-300 text-sm">
                Estimated Annual Cost
              </p>

              <p className="text-2xl font-bold text-white">
                $
                {annualCost.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        );
      })}

      <div className="flex justify-between mt-10">
        <button
          onClick={onBack}
          className="
            px-6
            py-3
            rounded-xl
            bg-slate-700
            text-white
            hover:bg-slate-600
          "
        >
          ← Back
        </button>

        <button
          onClick={onAnalyze}
          disabled={!isValid}
          className="
            px-6
            py-3
            rounded-xl
            bg-violet-600
            text-white
            font-semibold
            hover:bg-violet-700
            disabled:bg-gray-500
            disabled:cursor-not-allowed
          "
        >
          Analyze Costs →
        </button>
      </div>
    </div>
  );
}