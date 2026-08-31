"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { slugify } from "@/lib/utils";
import { findBranchSeed } from "@/lib/media/tipu-branches";
import { flattenZodError, type AdminFormState } from "@/lib/zod-helpers";

/**
 * Branch administration.
 *
 * The documented branch list ships in code (lib/media/tipu-branches.ts) so the
 * network is never empty, but everything an editor might need to change lives
 * here: name, location, description, photograph, activity, status, and whether
 * the branch has earned a dedicated page. Edits are stored as rows in
 * `tipu_branches` keyed by slug and merged over the baseline at read time.
 *
 * Replacing a placeholder with a real photograph is therefore an upload, not a
 * deploy — which is the whole point of the placeholder being a component rather
 * than a hard-coded image.
 */
const branchSchema = z.object({
  name: z.string().trim().min(2, "Branch name is required."),
  short_name: z.string().trim().optional(),
  branch_group: z.enum(["home", "nigeria", "diaspora", "growing"]),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  country: z.string().trim().optional(),
  acronym: z.string().trim().max(3, "Use at most three letters.").optional(),
  description: z.string().trim().optional(),
  status: z.enum(["active", "forming", "inactive"]),
  verification: z.enum(["verified", "community-record", "pending-verification"]),
  source_note: z.string().trim().optional(),
  status_note: z.string().trim().optional(),
  image_url: z.string().trim().optional(),
  image_alt: z.string().trim().optional(),
  established_label: z.string().trim().optional(),
  dedicated_page_href: z.string().trim().optional(),
  sort_order: z.coerce.number().int().default(0),
  is_featured: z.string().optional(),
  has_dedicated_page: z.string().optional(),
});

const orNull = (v: string | undefined) => (v && v.length > 0 ? v : null);

function toRow(d: z.infer<typeof branchSchema>) {
  return {
    name: d.name,
    short_name: orNull(d.short_name),
    branch_group: d.branch_group,
    city: orNull(d.city),
    state: orNull(d.state),
    country: orNull(d.country),
    acronym: orNull(d.acronym?.toUpperCase()),
    description: orNull(d.description),
    status: d.status,
    verification: d.verification,
    source_note: orNull(d.source_note),
    status_note: orNull(d.status_note),
    image_url: orNull(d.image_url),
    image_alt: orNull(d.image_alt),
    established_label: orNull(d.established_label),
    dedicated_page_href: orNull(d.dedicated_page_href),
    sort_order: d.sort_order,
    // Kept in step with `status` so anything still reading the older column
    // (and the network page's inactive filter) agrees with the new field.
    is_active: d.status !== "inactive",
    is_featured: d.is_featured === "on",
    has_dedicated_page: d.has_dedicated_page === "on",
  };
}

/**
 * Alt text is required whenever a photograph is set — a branch photo without it
 * is inaccessible, and the placeholder path has no such problem because its
 * artwork is decorative and the card's own text carries the meaning.
 */
function altTextError(d: z.infer<typeof branchSchema>): AdminFormState | null {
  if (d.image_url && d.image_url.length > 0 && (!d.image_alt || d.image_alt.trim().length < 3)) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: { image_alt: "Describe the photograph for screen readers." },
    };
  }
  return null;
}

export async function createBranchAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("administrator");
  const parsed = branchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  }
  const invalid = altTextError(parsed.data);
  if (invalid) return invalid;

  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const slug = slugify(parsed.data.name.replace(/^TIPU\s+/i, "").replace(/\s+(Branch|Chapter)$/i, ""));
  if (findBranchSeed(slug)) {
    return { status: "error", message: `“${slug}” already exists in the network — edit that branch instead.` };
  }

  const { error } = await supabase.from("tipu_branches").insert({ ...toRow(parsed.data), slug });
  if (error) return { status: "error", message: `Could not add branch: ${error.message}` };

  await logAudit(user.id, "create", "tipu_branch", undefined, { slug, name: parsed.data.name });
  revalidateBranchPaths();
  redirect("/admin/tipu/branches");
}

export async function updateBranchAction(
  slug: string,
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const user = await requireStaff("administrator");
  const parsed = branchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  }
  const invalid = altTextError(parsed.data);
  if (invalid) return invalid;

  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  // Upsert, not update: a branch from the shipped baseline has no row until the
  // first time somebody edits it.
  const { error } = await supabase
    .from("tipu_branches")
    .upsert({ ...toRow(parsed.data), slug }, { onConflict: "slug" });
  if (error) return { status: "error", message: `Could not save branch: ${error.message}` };

  await logAudit(user.id, "update", "tipu_branch", slug);
  revalidateBranchPaths();
  redirect("/admin/tipu/branches");
}

/**
 * Removes the editor's row for a branch. For a branch in the shipped baseline
 * this restores the values it was published with rather than deleting it — a
 * documented branch cannot be made to disappear by accident. Branches an
 * administrator created themselves are removed outright.
 */
export async function resetBranchAction(slug: string) {
  const user = await requireStaff("administrator");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("tipu_branches").delete().eq("slug", slug);
  await logAudit(user.id, findBranchSeed(slug) ? "update" : "delete", "tipu_branch", slug);
  revalidateBranchPaths();
}

const updateSchema = z.object({
  branch_slug: z.string().trim().min(1),
  kind: z.enum(["news", "event"]),
  title: z.string().trim().min(2, "Title is required."),
  body: z.string().trim().optional(),
  occurs_on: z.string().trim().optional(),
  status: z.enum(["draft", "published"]),
});

export async function createBranchUpdateAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const user = await requireStaff("editor");
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: flattenZodError(parsed.error) };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { error } = await supabase.from("tipu_branch_updates").insert({
    branch_slug: parsed.data.branch_slug,
    kind: parsed.data.kind,
    title: parsed.data.title,
    body: orNull(parsed.data.body),
    occurs_on: orNull(parsed.data.occurs_on),
    status: parsed.data.status,
    created_by: user.id,
  });
  if (error) return { status: "error", message: `Could not add update: ${error.message}` };

  await logAudit(user.id, "create", "tipu_branch_update", undefined, { branch: parsed.data.branch_slug });
  revalidateBranchPaths();
  return { status: "idle" };
}

export async function deleteBranchUpdateAction(id: string) {
  const user = await requireStaff("editor");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("tipu_branch_updates").delete().eq("id", id);
  await logAudit(user.id, "delete", "tipu_branch_update", id);
  revalidateBranchPaths();
}

function revalidateBranchPaths() {
  for (const path of [
    "/admin/tipu/branches",
    "/admin/tipu",
    "/",
    "/tipu",
    "/tipu/branches",
    "/diaspora",
  ]) {
    revalidatePath(path);
  }
}
