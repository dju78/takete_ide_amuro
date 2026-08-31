"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField, CheckboxField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/actions/admin-news";

const statusOptions = [
  { value: "draft", label: "Draft — not visible publicly" },
  { value: "pending_review", label: "Pending review — not visible publicly" },
  { value: "verified", label: "Verified — not visible publicly" },
  { value: "published", label: "Published — live on the site" },
  { value: "archived", label: "Archived — withdrawn from the site, record kept" },
];

export interface NewsFormOption {
  value: string;
  label: string;
}

interface Props {
  action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  categories: NewsFormOption[];
  branches: NewsFormOption[];
  projects: NewsFormOption[];
  defaultValues?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    body?: string;
    featured_image?: string;
    featured_image_alt?: string;
    status?: string;
    category_id?: string | null;
    is_featured?: boolean;
    published_at?: string | null;
    source_name?: string | null;
    source_url?: string | null;
    related_project_id?: string | null;
    related_branch_slug?: string | null;
    related_event_year?: number | null;
  };
}

const initialState: AdminFormState = { status: "idle" };

const NONE = { value: "", label: "— None —" };

/** yyyy-mm-dd for <input type="date">, from a timestamptz or null. */
function toDateInput(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

export function NewsForm({ action, categories, branches, projects, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, initialState);
  const dv = defaultValues ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.message && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>}

      <TextField label="Title" name="title" required defaultValue={dv.title} error={state.fieldErrors?.title} />
      <TextField
        label="Slug"
        name="slug"
        hint="Leave blank to auto-generate from the title. Changing it on a published article breaks existing links."
        defaultValue={dv.slug}
        error={state.fieldErrors?.slug}
      />
      <TextAreaField
        label="Excerpt"
        name="excerpt"
        rows={2}
        hint="The standfirst shown on cards, the newsroom lead and in search results."
        defaultValue={dv.excerpt}
        error={state.fieldErrors?.excerpt}
      />
      <TextAreaField
        label="Body (Markdown supported)"
        name="body"
        required
        rows={12}
        defaultValue={dv.body}
        error={state.fieldErrors?.body}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Category"
          name="category_id"
          hint="Drives the newsroom filters and the article's breadcrumb."
          options={[NONE, ...categories]}
          defaultValue={dv.category_id ?? ""}
        />
        <TextField
          label="Publication date"
          name="published_at"
          type="date"
          hint="Leave blank to use today when first published."
          defaultValue={toDateInput(dv.published_at)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Featured image URL"
          name="featured_image"
          hint="Supabase Storage public URL"
          defaultValue={dv.featured_image}
          error={state.fieldErrors?.featured_image}
        />
        <TextField
          label="Featured image alt text"
          name="featured_image_alt"
          hint="Required if an image is set. Describe what is visible, not who."
          defaultValue={dv.featured_image_alt}
          error={state.fieldErrors?.featured_image_alt}
        />
      </div>

      <fieldset className="rounded-2xl border border-purple-600/10 bg-purple-50/40 p-5">
        <legend className="px-2 text-sm font-semibold text-purple-600">Attribution</legend>
        <p className="mb-4 text-xs leading-relaxed text-charcoal/60">
          Only for a story reproduced from an outside source with permission. Leave blank for community
          articles — those are attributed to the union.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Source name" name="source_name" defaultValue={dv.source_name ?? ""} />
          <TextField
            label="Source URL"
            name="source_url"
            defaultValue={dv.source_url ?? ""}
            error={state.fieldErrors?.source_url}
          />
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-purple-600/10 bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-purple-600">Related content</legend>
        <p className="mb-4 text-xs leading-relaxed text-charcoal/60">
          Optional. Links the article to what it is about, and surfaces it on that page in return.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          <SelectField
            label="Development project"
            name="related_project_id"
            options={[NONE, ...projects]}
            defaultValue={dv.related_project_id ?? ""}
          />
          <SelectField
            label="TIPU branch"
            name="related_branch_slug"
            options={[NONE, ...branches]}
            defaultValue={dv.related_branch_slug ?? ""}
          />
          <TextField
            label="Takete-Ide Day year"
            name="related_event_year"
            type="number"
            defaultValue={dv.related_event_year != null ? String(dv.related_event_year) : ""}
            error={state.fieldErrors?.related_event_year}
          />
        </div>
      </fieldset>

      <SelectField
        label="Status"
        name="status"
        required
        options={statusOptions}
        defaultValue={dv.status}
        error={state.fieldErrors?.status}
      />

      <CheckboxField
        name="is_featured"
        defaultChecked={dv.is_featured ?? false}
        label={
          <>
            <span className="font-medium text-charcoal">Lead the newsroom with this article</span> — shows
            it at the top of /news. Only the most recent featured article is used.
          </>
        }
      />

      <SubmitButton>Save Article</SubmitButton>
    </form>
  );
}
