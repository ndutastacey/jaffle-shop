"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { money, moneyCompact, monthLabel } from "@/lib/format";

const COLORS = ["#c2410c", "#2563eb", "#16a34a", "#9333ea", "#db2777", "#0891b2"];

type Props = {
  data: Record<string, string | number>[];
  series: string[];
};

export default function RevenueLineChart({ data, series }: Props) {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tickFormatter={monthLabel} stroke="var(--muted)" fontSize={12} />
          <YAxis tickFormatter={moneyCompact} stroke="var(--muted)" fontSize={12} width={64} />
          <Tooltip
            formatter={(value) => money(Number(value))}
            labelFormatter={(label) => monthLabel(String(label))}
            contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
          />
          <Legend />
          {series.map((name, i) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              name={name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}