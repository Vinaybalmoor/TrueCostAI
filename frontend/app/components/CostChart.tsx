
"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type ToolData = {
  name: string;
  monthlySpend: string;
};

export default function CostChart({
  toolDetails,
}: {
  toolDetails: ToolData[];
}) {
  const data = toolDetails.map((tool) => ({
    name: tool.name,
    spend: Number(tool.monthlySpend),
  }));

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">
        Cost Breakdown
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Bar
            dataKey="spend"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}