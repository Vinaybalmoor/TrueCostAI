import Image from "next/image";

type Step2Props = {
  selectedTools: string[];
  setSelectedTools: (tools: string[]) => void;
  onNext: () => void;
  onBack: () => void;
};

const tools = [
  {
    name: "ChatGPT",
    logo: "/logos/chatgpt-logo-png.webp",
  },
  {
    name: "Claude",
    logo: "/logos/claude-ai-logo-png.webp",
  },
  {
    name: "Gemini",
    logo: "/logos/Gemini_logo_PNG.png",
  },
  {
    name: "Cursor",
    logo: "/logos/cursor-logo-png.png",
  },
  {
    name: "Copilot",
    logo: "/logos/GitHub-Copilot-Logo-PNG.png",
  },
  {
    name: "Perplexity",
    logo: "/logos/perplexity-ai-logo-rounded-hd-free-png.webp",
  },
];

export default function Step2({
  selectedTools,
  setSelectedTools,
  onNext,
  onBack,
}: Step2Props) {
  const toggleTool = (toolName: string) => {
    if (selectedTools.includes(toolName)) {
      setSelectedTools(selectedTools.filter((tool) => tool !== toolName));
    } else {
      setSelectedTools([...selectedTools, toolName]);
    }
  };

  return (
    <div className="bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-700 w-[900px]">
      <h1 className="text-4xl font-bold text-center mb-2 text-white">
  Select Your AI Stack
</h1>

<p className="text-center text-slate-400 mb-8">
  Choose the AI tools currently used by your team
</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <div
            key={tool.name}
            onClick={() => toggleTool(tool.name)}
            className={`
cursor-pointer
rounded-2xl
p-6
border
transition-all
duration-300
hover:scale-105
hover:shadow-xl
${
  selectedTools.includes(tool.name)
    ? "border-violet-500 bg-violet-900/30 shadow-violet-500/30 shadow-lg"
    : "border-slate-700 bg-slate-800"
}
`}
          >
            <div className="flex flex-col items-center gap-3">
              <Image src={tool.logo} alt={tool.name} width={60} height={60} />

              <p className="font-semibold">{tool.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-10">
  <button
    onClick={onBack}
    className="px-6 py-3 rounded-xl bg-slate-700 text-white hover:bg-slate-600"
  >
    ← Back
  </button>

  <button
    disabled={selectedTools.length === 0}
    onClick={onNext}
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
    Continue →
  </button>
      </div>
    </div>
  );
}
