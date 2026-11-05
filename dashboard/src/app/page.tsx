"use client";

import { useEffect, useState } from "react";
import type { MonthlyRow, Role, Store } from "@/lib/types";
import KpiCards from "@/components/KpiCards";
import RevenueLineChart from "@/components/RevenueLineChart";
import SimpleBarChart from "@/components/SimpleBarChart";

const STALE_AFTER_HOURS = 24;

export default function DashboardPage() {
  const [role, setRole] = useState<Role>("owner");
  const [stores, setStores] = useState<Store[]>([]);
  const [storeId, setStoreId] = useState("");
  const [rows, setRows] = useState<MonthlyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [builtAt, setBuiltAt] = useState("");
  const [stale, setStale] = useState(false);

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then((data: Store[]) => {
        setStores(data);
        if (data.length > 0) setStoreId(data[0].location_id);
      })
      .catch(() => setError("Could not load stores"));
  }, []);

  useEffect(() => {
    if (role === "manager" && !storeId) return;

    const params = new URLSearchParams({ role });
    if (role === "manager") params.set("location", storeId);

    fetch(`/api/revenue?${params}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
      })
      .then((data: MonthlyRow[]) => {
        setRows(data);
        const built = data[0]?.built_at ?? "";
        setBuiltAt(built);
        setStale(built ? Date.now() - Date.parse(built) > STALE_AFTER_HOURS * 60 * 60 * 1000 : false);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [role, storeId]);

  function changeRole(newRole: Role) {
    setLoading(true);
    setError("");
    setRole(newRole);
  }

  function changeStore(newStoreId: string) {
    setLoading(true);
    setError("");
    setStoreId(newStoreId);
  }

  const storeName = stores.find((s) => s.location_id === storeId)?.location_name ?? "";
  const months = [...new Set(rows.map((r) => r.month))].sort();
  const storeNames = [...new Set(rows.map((r) => r.location_name))];

  const lineData = months.map((month) => {
    const point: Record<string, string | number> = { month };
    rows
      .filter((r) => r.month === month)
      .forEach((r) => {
        point[r.location_name] = r.revenue;
      });
    return point;
  });

  const revenueByStore = storeNames
    .map((name) => ({
      label: name,
      value: rows.filter((r) => r.location_name === name).reduce((sum, r) => sum + r.revenue, 0),
    }))
    .sort((a, b) => b.value - a.value);

  const ordersByMonth = rows.map((r) => ({ label: r.month, value: r.order_count }));

  const builtLabel = builtAt
    ? new Date(builtAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Nairobi",
      })
    : "";

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>Jaffle Shop dashboard</h1>
          <p className="subtitle">
            {role === "owner" ? "All stores · monthly performance" : `${storeName} · monthly performance`}
          </p>
          {builtLabel && <p className="freshness">Data last updated: {builtLabel} (EAT)</p>}
        </div>

        <div className="controls">
          <label>
            View as
            <select value={role} onChange={(e) => changeRole(e.target.value as Role)}>
              <option value="owner">Owner</option>
              <option value="manager">Store manager</option>
            </select>
          </label>

          {role === "manager" && (
            <label>
              Store
              <select value={storeId} onChange={(e) => changeStore(e.target.value)}>
                {stores.map((s) => (
                  <option key={s.location_id} value={s.location_id}>
                    {s.location_name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </header>


      {error && <p className="notice error">{error}</p>}
      {loading && !error && <p className="notice">Loading…</p>}
      {!loading && !error && rows.length === 0 && (
        <p className="notice">No orders recorded for {storeName} yet.</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <>
          <KpiCards rows={rows} />

          <section className="card chart-card">
            <h2>Revenue by month</h2>
            <p>{role === "owner" ? "One line per store" : "Your store's monthly revenue"}</p>
            <RevenueLineChart data={lineData} series={storeNames} />
          </section>

          {role === "owner" ? (
            <section className="card chart-card">
              <h2>Total revenue by store</h2>
              <p>Which stores bring in the most</p>
              <SimpleBarChart data={revenueByStore} format="money" />
            </section>
          ) : (
            <section className="card chart-card">
              <h2>Orders by month</h2>
              <p>How busy the store was each month</p>
              <SimpleBarChart data={ordersByMonth} format="count" xIsMonth />
            </section>
          )}
        </>
      )}
    </main>
  );
}