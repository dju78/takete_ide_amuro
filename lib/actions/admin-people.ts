"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { slugify } from "@/lib/utils";
import { flattenZodError, type AdminFormState } from "@/lib/zod-helpers";

const categories = [
  "traditional_leaders", "community_leaders", "public_service", "academia", "education", "healthcare",
  "business", "entrepreneurship", "arts_culture", "sports", "diaspora", "young_achievers",
] as const;
const verificationStatuses = ["unverified", "oral_history", "community_tradition", "documentary_evidence", "verified", "disputed"] as const;
const contentStatuses = ["draft", "pending_review", "verified", "published", "archived"] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  slug: z.string().trim().optional(),
  category: z.enum(categories),
  photo_url: z.string().trim().optional(),
  biography: z.string().trim().optional(),
  achievements: z.string().trim().optional(),
  external_links: z.string().trim().optional(),
  verification_status: z.enum(verificationStatuses),
  status: z.enum(contentStatuses),
});

function parseLinks(raw?: string) {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|").map((s) => s.trim());
      return { label: label || url, url: url || label };
    });
}

function toRow(data: z.infer<typeof schema>) {
  return {
    name: data.name,
    slug: data.slug || slugify(data.name),
    category: data.category,
    photo_url: data.photo_url || null,
    biography: data.biography || null,
    achievements: data.achievements || null,
    external_links: parseLinks(data.external_links),
    verification_status: data.verification_status,
    status: data.status,
  };
}

export async function createPersonAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("editor");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { data, error } = await supabase.from("historical_people").insert({ ...toRow(parsed.data), created_by: user.id }).select("id").single();
  if (error || !data) return { status: "error", message: `Could not create profile: ${error?.message ?? "unknown error"}` };

  await logAudit(user.id, "create", "historical_person", data.id, { name: parsed.data.name });
  revalidatePath("/admin/people");
  revalidatePath("/our-people");
  redirect("/admin/people");
}

export async function updatePersonAction(id: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("editor");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("historical_people").update(toRow(parsed.data)).eq("id", id);
  if (error) return { status: "error", message: `Could not update profile: ${error.message}` };

  await logAudit(user.id, "update", "historical_person", id);
  revalidatePath("/admin/people");
  revalidatePath("/our-people");
  redirect("/admin/people");
}

export async function deletePersonAction(id: string) {
  const user = await requireStaff("editor");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("historical_people").delete().eq("id", id);
  await logAudit(user.id, "delete", "historical_person", id);
  revalidatePath("/admin/people");
  revalidatePath("/our-people");
}
