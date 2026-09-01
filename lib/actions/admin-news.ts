"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { slugify } from "@/lib/utils";
import { revalidateNewsPaths } from "@/lib/revalidation";

const newsSchema = z
  .object({
    title: z.string().trim().min(3, "Title is required."),
    slug: z.string().trim().optional(),
    excerpt: z.string().trim().optional(),
    body: z.string().trim().min(10, "Body must be at least 10 characters."),
    featured_image: z.string().trim().optional(),
    featured_image_alt: z.string().trim().optional(),
    status: z.enum(["draft", "pending_review", "verified", "published", "archived"]),
    category_id: z.string().trim().optional(),
    published_at: z.string().trim().optional(),
    is_featured: z.string().optional(),
    source_name: z.string().trim().optional(),
    source_url: z.string().trim().url("Enter a full URL, including https://").or(z.literal("")).optional(),
    related_project_id: z.string().trim().optional(),
    related_branch_slug: z.string().trim().optional(),
    related_event_year: z.string().trim().optional(),
  })
  // An image with no alt text is unusable to a screen reader, so the pairing is
  // enforced here rather than left to the author to remember.
  .refine((d) => !d.featured_image || (d.featured_image_alt ?? "").trim().length >= 3, {
    path: ["featured_image_alt"],
    message: "Describe the featured image for screen readers.",
  })
  .refine((d) => !d.related_event_year || /^\d{4}$/.test(d.related_event_year), {
    path: ["related_event_year"],
    message: "Enter a four-digit year.",
  });

const orNull = (v: string | undefined) => (v && v.trim().length > 0 ? v.trim() : null);

/** Columns shared by create and update, so the two cannot drift apart. */
function editorialFields(d: z.infer<typeof newsSchema>) {
  return {
    title: d.title,
    excerpt: orNull(d.excerpt),
    body: d.body,
    featured_image: orNull(d.featured_image),
    featured_image_alt: orNull(d.featured_image_alt),
    status: d.status,
    category_id: orNull(d.category_id),
    is_featured: d.is_featured === "on",
    source_name: orNull(d.source_name),
    source_url: orNull(d.source_url),
    related_project_id: orNull(d.related_project_id),
    related_branch_slug: orNull(d.related_branch_slug),
    related_event_year: d.related_event_year ? Number(d.related_event_year) : null,
  };
}

export interface AdminFormState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

export async function createNewsAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("editor");
  const parsed = newsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: flat(parsed.error) };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const slug = parsed.data.slug || slugify(parsed.data.title);
  // published_at is only stamped when the article actually goes live, so a draft
  // never carries a publication date it has not earned.
  const publishedAt =
    parsed.data.status === "published"
      ? (orNull(parsed.data.published_at) ?? new Date().toISOString())
      : null;

  const { data, error } = await supabase
    .from("news_articles")
    .insert({
      ...editorialFields(parsed.data),
      slug,
      published_at: publishedAt,
      created_by: user.id,
      author_id: user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { status: "error", message: `Could not create article: ${error?.message ?? "unknown error"}` };

  await logAudit(user.id, "create", "news_article", data.id, { title: parsed.data.title });
  revalidateNewsPaths(slug);
  redirect("/admin/news");
}

export async function updateNewsAction(id: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireStaff("editor");
  const parsed = newsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: flat(parsed.error) };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: "Supabase is not configured." };

  const { data: existing } = await supabase.from("news_articles").select("status, published_at").eq("id", id).maybeSingle();
  const isNewlyPublished = parsed.data.status === "published" && existing?.status !== "published";

  // An explicit date from the editor wins; otherwise stamp on first publish and
  // preserve whatever was there before.
  const explicitDate = orNull(parsed.data.published_at);
  const publishedAt =
    parsed.data.status === "published"
      ? (explicitDate ?? (isNewlyPublished ? new Date().toISOString() : existing?.published_at))
      : null;

  const slug = parsed.data.slug || slugify(parsed.data.title);
  const { error } = await supabase
    .from("news_articles")
    .update({
      ...editorialFields(parsed.data),
      slug,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (error) return { status: "error", message: `Could not update article: ${error.message}` };

  await logAudit(user.id, "update", "news_article", id);
  revalidateNewsPaths(slug);
  redirect("/admin/news");
}

export async function deleteNewsAction(id: string) {
  const user = await requireStaff("editor");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("news_articles").delete().eq("id", id);
  await logAudit(user.id, "delete", "news_article", id);
  revalidateNewsPaths();
}

function flat(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
