"use server";

import { z } from "zod";
import { getPublicSupabase } from "@/lib/supabase/server";

const rsvpSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required.").max(100, "Full name cannot exceed 100 characters."),
  email: z.string().trim().email("Please enter a valid email address.").max(100, "Email address cannot exceed 100 characters."),
  phone: z.string().trim().min(7, "Please enter a valid phone or WhatsApp number.").max(30, "Phone number cannot exceed 30 characters."),
  branchOrChapter: z.string().trim().max(100, "Branch name cannot exceed 100 characters.").optional(),
  country: z.string().trim().max(100, "Country name cannot exceed 100 characters.").optional(),
  partySize: z.coerce.number().int().min(1, "Party size must be at least 1.").max(50, "Party size cannot exceed 50.").default(1),
  accessibilityRequirements: z.string().trim().max(500, "Arrangements note cannot exceed 500 characters.").optional(),
  consent: z.literal(true, { message: "Consent is required to submit your RSVP." }),
});

export type RSVPFormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitCentenaryRSVP(
  _prevState: RSVPFormState | null,
  formData: FormData
): Promise<RSVPFormState> {
  // Anti-bot honeypot check
  if (formData.get("bot_field")) {
    return {
      success: true,
      message: "Thank you. Your attendance details have been received by the Takete-Ide Centenary organising committee.",
    };
  }

  const rawData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    branchOrChapter: formData.get("branchOrChapter"),
    country: formData.get("country"),
    partySize: formData.get("partySize") || 1,
    accessibilityRequirements: formData.get("accessibilityRequirements"),
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
  };

  const parsed = rsvpSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Please correct the errors in the form.",
    };
  }

  const supabase = getPublicSupabase();
  if (supabase) {
    const { error } = await supabase.from("centenary_rsvps").insert({
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      branch_or_chapter: parsed.data.branchOrChapter || null,
      country: parsed.data.country || null,
      party_size: parsed.data.partySize,
      accessibility_requirements: parsed.data.accessibilityRequirements || null,
      consent: parsed.data.consent,
      status: "submitted",
    });

    if (error) {
      return {
        success: false,
        message: "Unable to record your RSVP at this time. Please contact the official lines directly.",
      };
    }
  }

  return {
    success: true,
    message: "Thank you. Your attendance details have been received by the Takete-Ide Centenary organising committee.",
  };
}
