"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, requireFinancialAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { flattenZodError, type AdminFormState } from "@/lib/zod-helpers";

/**
 * Admin actions for the union's public-facing programme.
 *
 * The account action is deliberately stricter than the rest of the admin area:
 * a wrong account number sends community money to a stranger, so it requires a
 * super administrator or treasurer (never a general administrator), and it
 * writes the previous *and* new values into the audit log so a change can always
 * be traced and reversed. Audit logs are staff-only and never rendered publicly.
 */

const accountSchema = z.object({
  account_name: z.string().trim().min(3, "Account name is required."),
  bank_name: z.string().trim().min(2, "Bank name is required."),
  account_number: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "A Nigerian bank account number is 10 digits."),
  purpose: z.string().trim().optional(),
  is_active: z.string().optional(),
});

const orNull = (v: string | undefined) => (v && v.length > 0 ? v : null);

export async function saveSupportAccountAction(
  id: string | null,
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const user = await requireFinancialAdmin();
  const parsed = accountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  }
  const d = parsed.data;
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  // Capture the previous state before writing, so the audit entry records what
  // actually changed rather than only what it changed to.
  let previous: Record<string, unknown> | null = null;
  if (id) {
    const { data } = await supabase
      .from("support_accounts")
      .select("account_name, bank_name, account_number, purpose, is_active")
      .eq("id", id)
      .maybeSingle();
    previous = data ?? null;
  }

  const row = {
    account_name: d.account_name,
    bank_name: d.bank_name,
    account_number: d.account_number,
    purpose: orNull(d.purpose),
    is_active: d.is_active === "on",
    updated_by: user.id,
  };

  // Only one account may be publicly active at a time.
  if (row.is_active) {
    await supabase.from("support_accounts").update({ is_active: false }).neq("id", id ?? "");
  }

  const { data: saved, error } = id
    ? await supabase.from("support_accounts").update(row).eq("id", id).select("id").maybeSingle()
    : await supabase.from("support_accounts").insert(row).select("id").maybeSingle();

  if (error) return { status: "error", message: `Could not save the account: ${error.message}` };

  await logAudit(user.id, id ? "update" : "create", "support_account", saved?.id ?? id ?? undefined, {
    previous,
    next: { ...row, updated_by: undefined },
    changed_by_role: user.role,
  });

  revalidatePath("/support");
  revalidatePath("/");
  revalidatePath("/admin/support");
  return { status: "idle", message: "Account saved. The change has been recorded in the audit log." };
}

export async function deactivateSupportAccountAction(id: string) {
  const user = await requireFinancialAdmin();
  const supabase = await createClient();
  if (!supabase) return;
  const { data: previous } = await supabase
    .from("support_accounts")
    .select("account_name, bank_name, account_number, is_active")
    .eq("id", id)
    .maybeSingle();
  await supabase.from("support_accounts").update({ is_active: false, updated_by: user.id }).eq("id", id);
  await logAudit(user.id, "update", "support_account", id, {
    previous,
    next: { is_active: false },
    changed_by_role: user.role,
  });
  revalidatePath("/support");
  revalidatePath("/");
  revalidatePath("/admin/support");
}

// ── Centenary ───────────────────────────────────────────────────────────────

const centenarySchema = z.object({
  headline: z.string().trim().optional(),
  intro: z.string().trim().optional(),
  event_dates: z.string().trim().optional(),
  event_date: z.string().trim().optional(),
  event_time_label: z.string().trim().optional(),
  main_event_time: z.string().trim().optional(),
  venue: z.string().trim().optional(),
  theme: z.string().trim().optional(),
  programme_status: z.string().trim().optional(),
  programme_document_url: z.string().trim().optional(),
  attire_status: z.string().trim().optional(),
});

export async function updateCentenaryAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const user = await requireStaff("administrator");
  const parsed = centenarySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const d = parsed.data;
  const { error } = await supabase
    .from("centenary_settings")
    .update({
      headline: orNull(d.headline),
      intro: orNull(d.intro),
      event_dates: orNull(d.event_dates),
      event_date: orNull(d.event_date),
      event_time_label: orNull(d.event_time_label),
      main_event_time: orNull(d.main_event_time),
      venue: orNull(d.venue),
      theme: orNull(d.theme),
      programme_status: orNull(d.programme_status),
      programme_document_url: orNull(d.programme_document_url),
      attire_status: orNull(d.attire_status),
      updated_by: user.id,
    })
    .eq("id", true);

  if (error) return { status: "error", message: `Could not save: ${error.message}` };

  await logAudit(user.id, "update", "centenary_settings");
  for (const path of ["/", "/centenary", "/tipu", "/takete-ide-day"]) revalidatePath(path);
  return { status: "idle", message: "Centenary details saved." };
}

// ── Security Trust Fund ─────────────────────────────────────────────────────

const fundSchema = z.object({
  target_amount: z.coerce.number().min(0, "Enter the levy target."),
  amount_paid: z.coerce.number().min(0, "Enter the amount reported paid."),
  currency: z.string().trim().min(3).max(4).default("NGN"),
  // Required: publishing figures without the date they were reported would
  // present a dated record as a live balance.
  as_of: z.string().trim().min(1, "Record the date these figures were reported."),
  note: z.string().trim().optional(),
});

export async function updateTrustFundAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const user = await requireFinancialAdmin();
  const parsed = fundSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { data: previous } = await supabase
    .from("security_trust_fund")
    .select("target_amount, amount_paid, as_of")
    .eq("id", true)
    .maybeSingle();

  const d = parsed.data;
  const { error } = await supabase
    .from("security_trust_fund")
    .update({
      target_amount: d.target_amount,
      amount_paid: d.amount_paid,
      currency: d.currency,
      as_of: d.as_of,
      note: orNull(d.note),
      updated_by: user.id,
    })
    .eq("id", true);

  if (error) return { status: "error", message: `Could not save: ${error.message}` };

  await logAudit(user.id, "update", "security_trust_fund", undefined, {
    previous,
    next: { target_amount: d.target_amount, amount_paid: d.amount_paid, as_of: d.as_of },
    changed_by_role: user.role,
  });
  for (const path of ["/support", "/development"]) revalidatePath(path);
  return { status: "idle", message: "Fund figures saved." };
}
