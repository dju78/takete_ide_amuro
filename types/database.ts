/**
 * Minimal Supabase Database type. The full generated type (from
 * `supabase gen types typescript`) should replace this once a live project
 * exists — see docs/DATABASE.md. Domain-specific shapes used across the app
 * live in types/content.ts, types/family.ts, types/weather.ts instead of
 * being derived from this generic, so the UI isn't blocked on codegen.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
