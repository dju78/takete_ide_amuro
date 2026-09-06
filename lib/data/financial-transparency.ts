import { getPublicSupabase } from "@/lib/supabase/server";

export interface FinancialReport {
  id: string;
  reporting_period: string;
  opening_balance: number;
  receipts: number;
  expenditure: number;
  closing_balance: number;
  currency: string;
  supporting_report_url: string | null;
  notes: string | null;
  approval_note: string | null;
  verification_status: string;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export async function getPublishedFinancialReports(): Promise<FinancialReport[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("financial_reports")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as FinancialReport[];
}
