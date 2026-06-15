type Step1Props = {
  teamSize: string;
  setTeamSize: (value: string) => void;
  primaryUseCase: string;
  setPrimaryUseCase: (value: string) => void;
  onNext: () => void;
};

export default function Step1({
  teamSize,
  setTeamSize,
  primaryUseCase,
  setPrimaryUseCase,
  onNext,
}: Step1Props) {
  return (
    <div className="bg-slate-900 p-10 rounded-2xl shadow-2xl w-[500px] border border-slate-700">
     <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
  TRUECOST AI
</h1>

<p className="text-slate-400 text-center mb-8">
  Step 1: Company Information
</p>

      <div className="mb-5">
        <label className="block mb-2 font-medium">Team Size</label>

        <select
  title="Team Size"
  value={teamSize}
  onChange={(e) => setTeamSize(e.target.value)}
  className="
    w-full
    p-4
    rounded-xl
    bg-slate-800
    text-white
    border
    border-slate-600
    focus:outline-none
    focus:ring-2
    focus:ring-violet-500
  "
>
  <option value="" className="text-black">
    Select Team Size
  </option>
  <option value="1-5" className="text-black">
    1-5
  </option>
  <option value="6-20" className="text-black">
    6-20
  </option>
  <option value="21-50" className="text-black">
    21-50
  </option>
  <option value="51-100" className="text-black">
    51-100
  </option>
  <option value="100+" className="text-black">
    100+
  </option>
</select>
      </div>

      <div className="mb-8">
  <label className="block mb-2 font-medium text-white">
    Primary Use Case
  </label>

  <select
    title="Primary Use Case"
    value={primaryUseCase}
    onChange={(e) => setPrimaryUseCase(e.target.value)}
    className="
      w-full
      p-4
      rounded-xl
      bg-slate-800
      text-white
      border
      border-slate-600
      focus:outline-none
      focus:ring-2
      focus:ring-violet-500
    "
  >
    <option value="" className="text-black">
      Select Use Case
    </option>

    <option value="coding" className="text-black">
      Software Development
    </option>

    <option value="content" className="text-black">
      Content Creation
    </option>

    <option value="research" className="text-black">
      Research & Analysis
    </option>

    <option value="support" className="text-black">
      Customer Support
    </option>

    <option value="marketing" className="text-black">
      Marketing
    </option>

    <option value="design" className="text-black">
      Design & Creative
    </option>
  </select>
</div>

      <button
  onClick={onNext}
  disabled={!teamSize || !primaryUseCase}
  className="
    w-full
    bg-violet-600
    hover:bg-violet-700
    text-white
    py-3
    rounded-xl
    font-semibold
    transition
    disabled:bg-gray-500
    disabled:cursor-not-allowed
  "
>
  Next →
</button>
    </div>
  );
}
