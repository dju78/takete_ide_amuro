"use server";

import { createClient } from "@/lib/supabase/server";
import {
  contactSchema,
  diasporaSchema,
  volunteerSchema,
  nominationSchema,
  heritageSubmissionSchema,
} from "@/lib/validations";

export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

const NOT_CONFIGURED_MESSAGE =
  "This form isn't connected to a database yet in this environment. Please try again once Supabase is configured, or reach out via the contact details on this site.";

function firstFieldErrors(flat: Record<string, string[] | undefined>) {
  const errors: Record<string, string> = {};
  for (const [key, value] of Object.entries(flat)) {
    if (value?.[0]) errors[key] = value[0];
  }
  return errors;
}

export async function submitContactForm(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", fieldErrors: firstFieldErrors(parsed.error.flatten().fieldErrors), message: "Please check the form and try again." };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: NOT_CONFIGURED_MESSAGE };

  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject || null,
    message: parsed.data.message,
    consent_given: true,
  });
  if (error) return { status: "error", message: "Something went wrong sending your message. Please try again." };
  return { status: "success", message: "Thank you — your message has been received. We'll be in touch soon." };
}

export async function submitDiasporaForm(_prevState: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData);
  const parsed = diasporaSchema.safeParse({
    ...raw,
    contribution_interests: formData.getAll("contribution_interests"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: firstFieldErrors(parsed.error.flatten().fieldErrors), message: "Please check the form and try again." };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: NOT_CONFIGURED_MESSAGE };

  const { error } = await supabase.from("diaspora_members").insert({
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    country: parsed.data.country,
    city: parsed.data.city || null,
    profession: parsed.data.profession || null,
    area_of_expertise: parsed.data.area_of_expertise || null,
    family_compound: parsed.data.family_compound || null,
    contribution_interests: parsed.data.contribution_interests ?? [],
    consent_given: true,
  });
  if (error) return { status: "error", message: "Something went wrong submitting your registration. Please try again." };
  return { status: "success", message: "Thank you for joining the Takete-Ide community network — we'll be in touch." };
}

export async function submitVolunteerForm(_prevState: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData);
  const parsed = volunteerSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", fieldErrors: firstFieldErrors(parsed.error.flatten().fieldErrors), message: "Please check the form and try again." };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: NOT_CONFIGURED_MESSAGE };

  const { error } = await supabase.from("volunteer_submissions").insert({
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    country: parsed.data.country || null,
    interest_area: parsed.data.interest_area,
    message: parsed.data.message || null,
  });
  if (error) return { status: "error", message: "Something went wrong submitting your interest. Please try again." };
  return { status: "success", message: "Thank you — the Get Involved team will be in touch soon." };
}

export async function submitNomination(_prevState: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData);
  const parsed = nominationSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", fieldErrors: firstFieldErrors(parsed.error.flatten().fieldErrors), message: "Please check the form and try again." };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: NOT_CONFIGURED_MESSAGE };

  const { error } = await supabase.from("community_profile_nominations").insert({
    nominee_name: parsed.data.nominee_name,
    category: parsed.data.category,
    biography: parsed.data.biography,
    achievements: parsed.data.achievements || null,
    evidence_source: parsed.data.evidence_source || null,
    submitter_name: parsed.data.submitter_name,
    submitter_email: parsed.data.submitter_email,
    permission_confirmed: true,
  });
  if (error) return { status: "error", message: "Something went wrong submitting this nomination. Please try again." };
  return { status: "success", message: "Thank you — this nomination will be reviewed by the editorial team before publication." };
}

export async function submitHeritageMaterial(_prevState: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData);
  const parsed = heritageSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", fieldErrors: firstFieldErrors(parsed.error.flatten().fieldErrors), message: "Please check the form and try again." };
  }
  const supabase = await createClient();
  if (!supabase) return { status: "error", message: NOT_CONFIGURED_MESSAGE };

  const { error } = await supabase.from("heritage_submissions").insert({
    submission_type: parsed.data.submission_type,
    family_name: parsed.data.family_name || null,
    compound: parsed.data.compound || null,
    submitter_name: parsed.data.submitter_name,
    submitter_relationship: parsed.data.submitter_relationship || null,
    submitter_email: parsed.data.submitter_email,
    submitter_phone: parsed.data.submitter_phone || null,
    payload: { details: parsed.data.details, source_information: parsed.data.source_information || null },
    permission_to_archive: true,
    permission_to_publish: parsed.data.permission_to_publish === "on",
  });
  if (error) return { status: "error", message: "Something went wrong submitting this material. Please try again." };
  return {
    status: "success",
    message: "Thank you for helping preserve Takete-Ide's heritage. Your submission has entered the archive review queue and will not be published until reviewed.",
  };
}
