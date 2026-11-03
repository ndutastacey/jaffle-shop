import { NextResponse } from "next/server";
import { bigquery, table } from "@/lib/bigquery";
import type { Store } from "@/lib/types";


export async function GET() {
  const query = `
    select location_id, location_name
    from ${table("locations")}
    order by location_name
  `;

  try {
    const [rows] = await bigquery.query({ query, location: "US" });
    return NextResponse.json(rows as Store[]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not load stores" }, { status: 500 });
  }
}