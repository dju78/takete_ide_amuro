"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { logAudit } from "@/lib/data/admin";
import { slugify } from "@/lib/utils";

const newsSchema = z.object({
  title: z.string().trim().min(3, "Title is required."),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().optional(),
  body: z.string().trim().min(10, "Body must be at least 10 characters."),
  featured_image: z.string().trim().optional(),
  featured_image_alt: z.string().trim().optional(),
  status: z.enum(["draft", "pending_review", "verified", "published", "archived"]),
});

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
  const { data, error } = await supabase
    .from("news_articles")
    .insert({
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt || null,
      body: parsed.data.body,
      featured_image: parsed.data.featured_image || null,
      featured_image_alt: parsed.data.featured_image_alt || null,
      status: parsed.data.status,
      published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
      created_by: user.id,
      author_id: user.id,
    })
    .select("id")
    .single();

  if (error || !data) return { status: "error", message: `Could not create article: ${error?.message ?? "unknown error"}` };

  await logAudit(user.id, "create", "news_article", data.id, { title: parsed.data.title });
  revalidatePath("/admin/news");
  revalidatePath("/news");
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

  const { error } = await supabase
    .from("news_articles")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug || slugify(parsed.data.title),
      excerpt: parsed.data.excerpt || null,
      body: parsed.data.body,
      featured_image: parsed.data.featured_image || null,
      featured_image_alt: parsed.data.featured_image_alt || null,
      status: parsed.data.status,
      published_at: isNewlyPublished ? new Date().toISOString() : existing?.published_at,
    })
    .eq("id", id);

  if (error) return { status: "error", message: `Could not update article: ${error.message}` };

  await logAudit(user.id, "update", "news_article", id);
  revalidatePath("/admin/news");
  revalidatePath("/news");
  redirect("/admin/news");
}

export async function deleteNewsAction(id: string) {
  const user = await requireStaff("editor");
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("news_articles").delete().eq("id", id);
  await logAudit(user.id, "delete", "news_article", id);
  revalidatePath("/admin/news");
  revalidatePath("/news");
}

function flat(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
