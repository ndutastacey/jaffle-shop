"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { count, money, moneyCompact, monthLabel } from "@/lib/format";

type Props = {
  data: { label: string; value: number }[];
  format: "money" | "count";
  xIsMonth?: boolean;
};

export default function SimpleBarChart({ data, format, xIsMonth = false }: Props) {
  const formatValue = format === "money" ? money : count;
  const formatAxis = format === "money" ? moneyCompact : count;
  const formatLabel = (label: string) => (xIsMonth ? monthLabel(label) : label);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tickFormatter={formatLabel} stroke="var(--muted)" fontSize={12} />
          <YAxis tickFormatter={formatAxis} stroke="var(--muted)" fontSize={12} width={64} />
          <Tooltip
            formatter={(value) => formatValue(Number(value))}
            labelFormatter={(label) => formatLabel(String(label))}
            contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
          />
          <Bar dataKey="value" name={format === "money" ? "Revenue" : "Orders"} fill="#c2410c" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}