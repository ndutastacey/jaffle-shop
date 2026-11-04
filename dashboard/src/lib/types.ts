export type Role = "owner" | "manager";

export type MonthlyRow = {
  location_id: string;
  location_name: string;
  month: string; 
  order_count: number;
  revenue: number;
  gross_profit: number;
  avg_order_value: number;
  built_at: string;
};

export type Store = {
  location_id: string;
  location_name: string;
};