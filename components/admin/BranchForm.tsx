"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField, CheckboxField } from "@/components/forms/FormField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/zod-helpers";
import type { ResolvedBranch } from "@/lib/data/tipu-branches";

const groupOptions = [
  { value: "home", label: "Home & Community — Takete-Ide and its immediate area" },
  { value: "nigeria", label: "Across Nigeria" },
  { value: "diaspora", label: "Global Community — diaspora chapters" },
  { value: "growing", label: "Growing Network — details still being confirmed" },
];

const statusOptions = [
  { value: "active", label: "Active — meeting and operating" },
  { value: "forming", label: "Forming — announced but not yet confirmed operational" },
  { value: "inactive", label: "Inactive — hidden from the public network page" },
];

const verificationOptions = [
  { value: "verified", label: "Verified — confirmed against a formal union document" },
  { value: "community-record", label: "Community record — appears repeatedly in union communications" },
  { value: "pending-verification", label: "Pending verification — single mention, or unresolved ambiguity" },
];

const initialState: AdminFormState = { status: "idle" };

export function BranchForm({
  branch,
  action,
  submitLabel = "Save branch",
}: {
  branch?: ResolvedBranch;
  action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Branch name"
          name="name"
          required
          hint="Full public name, e.g. “TIPU Kaduna Branch”"
          defaultValue={branch?.name}
          error={state.fieldErrors?.name}
        />
        <TextField
          label="Display name"
          name="short_name"
          hint="Compact label for the homepage strip, e.g. “Kaduna”"
          defaultValue={branch?.shortName}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Group" name="branch_group" required options={groupOptions} defaultValue={branch?.group} />
        <TextField
          label="Monogram"
          name="acronym"
          hint="Two letters, used on the placeholder artwork"
          defaultValue={branch?.acronym}
          error={state.fieldErrors?.acronym}
        />
      </div>

      <fieldset className="rounded-2xl border border-purple-600/10 bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-purple-600">Location</legend>
        <p className="mb-4 text-xs leading-relaxed text-charcoal/60">
          Fill only the parts the record actually supports. Leave the state blank rather than guessing
          one, and leave the city blank for a branch recorded only at state level.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField label="City / town" name="city" defaultValue={branch?.city ?? ""} />
          <TextField label="State / region" name="state" defaultValue={branch?.state ?? ""} />
          <TextField label="Country" name="country" defaultValue={branch?.country ?? ""} />
        </div>
      </fieldset>

      <TextAreaField
        label="Description"
        name="description"
        rows={3}
        hint="Leave the standard network wording if nothing beyond the branch's existence is confirmed."
        defaultValue={branch?.description}
      />

      <fieldset className="rounded-2xl border border-purple-600/10 bg-purple-50/40 p-5">
        <legend className="px-2 text-sm font-semibold text-purple-600">Status &amp; evidence</legend>
        <p className="mb-4 text-xs leading-relaxed text-charcoal/60">
          These answer two different questions. <strong>Status</strong> is whether the branch is
          operating. <strong>Verification</strong> is how well the community record attests it. A branch
          can be well evidenced as still forming.
        </p>
        <div className="flex flex-col gap-5">
          <SelectField label="Status" name="status" required options={statusOptions} defaultValue={branch?.status} />
          <SelectField
            label="Verification"
            name="verification"
            required
            options={verificationOptions}
            defaultValue={branch?.verification}
          />
          <TextField
            label="Public status note"
            name="status_note"
            hint="Optional. Overrides the default wording shown on the card for an unsettled record."
            defaultValue={branch?.statusNote ?? ""}
          />
          <TextAreaField
            label="Source note (internal)"
            name="source_note"
            rows={3}
            hint="Which union communication documents this branch, and any ambiguity to resolve. Never shown publicly."
            defaultValue={branch?.sourceNote ?? ""}
          />
          <TextField
            label="Established"
            name="established_label"
            hint="Free text, e.g. “August 2026”. Leave blank unless the date is verified."
            defaultValue={branch?.establishedLabel ?? ""}
          />
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-purple-600/10 bg-purple-50/40 p-5">
        <legend className="px-2 text-sm font-semibold text-purple-600">Branch photograph</legend>
        <p className="mb-4 text-xs leading-relaxed text-charcoal/60">
          With no photograph the branch card shows the union&rsquo;s branded placeholder — which is a
          finished design, not a gap. Upload an authentic photograph of this branch to replace it. Never
          upload stock photography or a generated image of the city.
        </p>
        <div className="flex flex-col gap-5">
          <FileUploadField
            name="image_url"
            label="Photograph"
            bucket="tipu"
            accept="image/*"
            defaultUrl={branch?.image}
          />
          <TextField
            label="Photograph alt text"
            name="image_alt"
            hint="Required once a photograph is uploaded. Describe what is visible, not who."
            defaultValue={branch?.imageAlt ?? ""}
            error={state.fieldErrors?.image_alt}
          />
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-purple-600/10 bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-purple-600">Visibility</legend>
        <div className="flex flex-col gap-4">
          <CheckboxField
            name="is_featured"
            defaultChecked={branch?.featured ?? false}
            label={
              <>
                <span className="font-medium text-charcoal">Featured</span> — include in the homepage
                branch strip.
              </>
            }
          />
          <CheckboxField
            name="has_dedicated_page"
            defaultChecked={Boolean(branch?.href)}
            label={
              <>
                <span className="font-medium text-charcoal">Has a dedicated page</span> — only enable once
                there is enough content to fill one. The card then links to the address below.
              </>
            }
          />
          <TextField
            label="Dedicated page address"
            name="dedicated_page_href"
            hint="e.g. /tipu/branches/lokoja"
            defaultValue={branch?.href ?? ""}
          />
          <TextField
            label="Sort order"
            name="sort_order"
            type="number"
            hint="Lower numbers appear first within the group"
            defaultValue={String(branch?.sortOrder ?? 0)}
          />
        </div>
      </fieldset>

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
