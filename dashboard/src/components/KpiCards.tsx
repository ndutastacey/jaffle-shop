import type { MonthlyRow } from "@/lib/types";
import { count, money, moneyCents } from "@/lib/format";

export default function KpiCards({ rows }: { rows: MonthlyRow[] }) {
  const revenue = rows.reduce((sum, r) => sum + r.revenue, 0);
  const orders = rows.reduce((sum, r) => sum + r.order_count, 0);
  const profit = rows.reduce((sum, r) => sum + r.gross_profit, 0);
  const avgOrder = orders > 0 ? revenue / orders : 0;

  const cards = [
    { label: "Revenue", value: money(revenue) },
    { label: "Orders", value: count(orders) },
    { label: "Average order", value: moneyCents(avgOrder) },
    { label: "Gross profit", value: money(profit) },
  ];

  return (
    <div className="kpis">
      {cards.map((card) => (
        <div className="card" key={card.label}>
          <span className="kpi-label">{card.label}</span>
          <span className="kpi-value">{card.value}</span>
        </div>
      ))}
    </div>
  );
}