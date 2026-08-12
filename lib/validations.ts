import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, "Please enter a message of at least 10 characters."),
  consent: z.literal("on", { message: "Please confirm you agree to be contacted about this message." }),
});

export const diasporaSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  country: z.string().trim().min(2, "Please enter your country."),
  city: z.string().trim().optional(),
  profession: z.string().trim().optional(),
  area_of_expertise: z.string().trim().optional(),
  family_compound: z.string().trim().optional(),
  contribution_interests: z.array(z.string()).optional(),
  consent: z.literal("on", { message: "Please confirm your consent to be contacted." }),
});

export const volunteerSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().optional(),
  country: z.string().trim().optional(),
  interest_area: z.enum([
    "volunteer_skills",
    "community_projects",
    "diaspora_participation",
    "share_historical_materials",
    "oral_history_contribution",
    "community_partnerships",
    "youth_engagement",
  ]),
  message: z.string().trim().optional(),
});

export const nominationSchema = z.object({
  nominee_name: z.string().trim().min(2, "Please enter the nominee's name."),
  category: z.string().trim().min(2, "Please choose a category."),
  biography: z.string().trim().min(20, "Please provide a short biography (at least 20 characters)."),
  achievements: z.string().trim().optional(),
  evidence_source: z.string().trim().optional(),
  submitter_name: z.string().trim().min(2, "Please enter your name."),
  submitter_email: z.string().trim().email("Please enter a valid email address."),
  permission: z.literal("on", { message: "Please confirm you have permission to submit this nomination." }),
});

export const heritageSubmissionSchema = z.object({
  submission_type: z.enum(["family_history", "oriki", "historical_material", "oral_history", "photo_identification"]),
  family_name: z.string().trim().optional(),
  compound: z.string().trim().optional(),
  submitter_name: z.string().trim().min(2, "Please enter your name."),
  submitter_relationship: z.string().trim().optional(),
  submitter_email: z.string().trim().email("Please enter a valid email address."),
  submitter_phone: z.string().trim().optional(),
  details: z.string().trim().min(10, "Please share some detail about what you're contributing."),
  source_information: z.string().trim().optional(),
  permission_to_archive: z.literal("on", { message: "Please confirm permission to archive this material." }),
  permission_to_publish: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type DiasporaInput = z.infer<typeof diasporaSchema>;
export type VolunteerInput = z.infer<typeof volunteerSchema>;
export type NominationInput = z.infer<typeof nominationSchema>;
export type HeritageSubmissionInput = z.infer<typeof heritageSubmissionSchema>;
