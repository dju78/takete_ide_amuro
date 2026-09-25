import { z } from "zod";

export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const FIELD_LIMITS = {
  name: { min: 2, max: 60 },
  familyName: { min: 2, max: 70 },
  title: { min: 0, max: 80 },
  greeting: { min: 0, max: 60 },
  message: { min: 5, max: 280 },
  signOff: { min: 0, max: 60 },
  localExpression: { min: 0, max: 80 },
} as const;

/**
 * Strips HTML tags and unsafe script injections, trimming whitespace.
 */
export function sanitizeTextInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>?/gm, "") // Strip HTML tags
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Strip control characters
    .trim();
}

/**
 * Validates an uploaded image file before processing.
 */
export function validateUploadedPhoto(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: "Please select an image file to upload." };
  }

  // Check MIME type
  const isTypeAllowed = ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) ||
    /\.(jpe?g|png|webp)$/i.test(file.name);

  if (!isTypeAllowed) {
    return {
      isValid: false,
      error: "Unsupported file format. Please upload a JPG, JPEG, PNG, or WebP photograph.",
    };
  }

  // Check file size
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `The selected photo (${sizeInMb} MB) exceeds the 10 MB maximum limit. Please choose a smaller photograph.`,
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: "The selected file is empty. Please select a valid photograph.",
    };
  }

  return { isValid: true };
}

/**
 * Generates a clean, safe, sanitized export filename for downloaded posters.
 * Format: `takete-ide-centenary-daramola-omoyele.png`
 */
export function generateExportFilename(
  prefix: string,
  personOrFamilyName: string,
  extension = "png"
): string {
  const basePrefix = prefix.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
  const sanitizedName = (personOrFamilyName || "celebration")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

  const cleanSuffix = sanitizedName || "celebration";
  return `${basePrefix}-${cleanSuffix}.${extension}`;
}

export const PersonalisationSchema = z.object({
  name: z
    .string()
    .max(FIELD_LIMITS.name.max, `Name cannot exceed ${FIELD_LIMITS.name.max} characters`)
    .transform(sanitizeTextInput)
    .optional()
    .default(""),
  familyName: z
    .string()
    .max(FIELD_LIMITS.familyName.max, `Family name cannot exceed ${FIELD_LIMITS.familyName.max} characters`)
    .transform(sanitizeTextInput)
    .optional()
    .default(""),
  title: z
    .string()
    .max(FIELD_LIMITS.title.max, `Title cannot exceed ${FIELD_LIMITS.title.max} characters`)
    .transform(sanitizeTextInput)
    .optional()
    .default(""),
  greeting: z
    .string()
    .max(FIELD_LIMITS.greeting.max, `Greeting cannot exceed ${FIELD_LIMITS.greeting.max} characters`)
    .transform(sanitizeTextInput)
    .optional()
    .default(""),
  message: z
    .string()
    .max(FIELD_LIMITS.message.max, `Message cannot exceed ${FIELD_LIMITS.message.max} characters`)
    .transform(sanitizeTextInput)
    .default(""),
  signOff: z
    .string()
    .max(FIELD_LIMITS.signOff.max, `Sign-off cannot exceed ${FIELD_LIMITS.signOff.max} characters`)
    .transform(sanitizeTextInput)
    .optional()
    .default(""),
  localExpression: z
    .string()
    .max(FIELD_LIMITS.localExpression.max, `Expression cannot exceed ${FIELD_LIMITS.localExpression.max} characters`)
    .transform(sanitizeTextInput)
    .optional()
    .default(""),
});
