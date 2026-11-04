import { NextRequest, NextResponse } from "next/server";
import { bigquery, table } from "@/lib/bigquery";
import type { MonthlyRow } from "@/lib/types";


export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get("role");
  const location = request.nextUrl.searchParams.get("location");

  if (role !== "owner" && role !== "manager") {
    return NextResponse.json(
      { error: "role must be 'owner' or 'manager'" },
      { status: 400 }
    );
  }

  if (role === "manager" && !location) {
    return NextResponse.json(
      { error: "a store manager must choose a store" },
      { status: 400 }
    );
  }

  const where = role === "manager" ? "where location_id = @location" : "";

  const query = `
    select
      location_id,
      location_name,
      cast(revenue_month as string) as month,
      order_count,
      cast(revenue as float64) as revenue,
      cast(gross_profit as float64) as gross_profit,
      cast(avg_order_value as float64) as avg_order_value,
      format_timestamp('%Y-%m-%dT%H:%M:%SZ', built_at) as built_at
    from ${table("location_monthly_revenue")}
    ${where}
    order by month, location_name
  `;

  try {
    const [rows] = await bigquery.query({
      query,
      location: "US",
      ...(role === "manager" ? { params: { location: location as string } } : {}),
    });

    return NextResponse.json(rows as MonthlyRow[]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not load data" }, { status: 500 });
  }
}