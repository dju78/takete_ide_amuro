import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  FINANCIAL_ROLES,
  FINANCIAL_MIN_ROLE,
  isFinancialAdmin,
  roleRank,
} from "@/lib/auth";
import type { UserRole } from "@/types/content";

/**
 * Who may see contribution records, under the shared Supabase architecture.
 *
 * Takete-Ide now shares a Supabase project with Kogi Quest, so "signed in" no
 * longer implies "belongs here". Financial access is the conjunction of four
 * things: an authenticated user, an *active* membership for app_key 'takete',
 * and a role of super_admin or treasurer. Two independent layers enforce it —
 * requireFinancialAdmin in the application, is_takete_financial_staff() in the
 * database — and both are checked below.
 *
 * The role-by-role cases run against the real exported predicates rather than
 * against seeded login sessions: the CI environment has no Supabase project, and
 * pointing tests at the shared Kogi Quest database to create users is precisely
 * what this phase is forbidden to do. What that costs is noted in each test that
 * asserts structure rather than behaviour.
 */

const REPO = process.cwd();
const AUTH_SOURCE = readFileSync(join(REPO, "lib/auth.ts"), "utf8");
const BASE_MIGRATION = readFileSync(
  join(REPO, "supabase/migrations/0001_extensions_enums_profiles.sql"),
  "utf8",
);
const CONTRIBUTIONS_MIGRATION = readFileSync(
  join(REPO, "supabase/migrations/0019_contributions.sql"),
  "utf8",
);

const ALL_ROLES: UserRole[] = [
  "media_manager",
  "project_manager",
  "historian",
  "treasurer",
  "editor",
  "administrator",
  "super_admin",
];

test.describe("Financial authorization by role", () => {
  test("D + E — treasurer and super_admin are the only roles granted financial access", () => {
    expect(FINANCIAL_ROLES).toEqual(["super_admin", "treasurer"]);
    expect(isFinancialAdmin("treasurer")).toBe(true);
    expect(isFinancialAdmin("super_admin")).toBe(true);
  });

  test("B + C — editor and administrator are denied, along with every other role", () => {
    const denied = ALL_ROLES.filter((role) => !FINANCIAL_ROLES.includes(role));
    expect(denied).toContain("editor");
    expect(denied).toContain("administrator");
    for (const role of denied) {
      expect(isFinancialAdmin(role), `${role} must not have financial access`).toBe(false);
    }
  });

  test("an administrator does not reach the ledger by outranking a treasurer", () => {
    // Rank and financial access point in opposite directions here, which is the
    // whole reason financial screens test membership rather than rank.
    expect(roleRank.administrator).toBeGreaterThan(roleRank.treasurer);
    expect(isFinancialAdmin("administrator")).toBe(false);
    expect(isFinancialAdmin("treasurer")).toBe(true);
  });
});

test.describe("Treasurer lockout regression", () => {
  test("D — the rank floor on financial screens excludes no financial role", () => {
    // The bug this replaces: requireFinancialAdmin called requireStaff("editor"),
    // and a treasurer ranks below an editor, so the rank gate redirected them
    // before the financial check was ever reached. Every financial role must
    // clear the floor.
    for (const role of FINANCIAL_ROLES) {
      expect(
        roleRank[role],
        `${role} must not be excluded by the financial rank floor`,
      ).toBeGreaterThanOrEqual(roleRank[FINANCIAL_MIN_ROLE]);
    }
  });

  test("the fix did not promote a treasurer's editorial rank", () => {
    // The other way to make the symptom disappear would be to raise treasurer
    // above editor, which would hand a financial specialist editorial authority
    // across the whole admin area. It must stay a rank-1 specialist.
    expect(roleRank.treasurer).toBe(1);
    expect(roleRank.treasurer).toBeLessThan(roleRank.editor);
    expect(roleRank.treasurer).toBe(roleRank.historian);
    expect(roleRank.treasurer).toBe(roleRank.media_manager);
  });

  test("requireFinancialAdmin does not impose an editor rank gate", () => {
    const fn = AUTH_SOURCE.slice(AUTH_SOURCE.indexOf("export async function requireFinancialAdmin"));
    expect(fn).not.toMatch(/requireStaff\(\s*["']editor["']\s*\)/);
    expect(fn).toMatch(/requireStaff\(FINANCIAL_MIN_ROLE\)/);
    expect(fn).toMatch(/FINANCIAL_ROLES\.includes/);
  });
});

test.describe("Membership scoping — shared Supabase project", () => {
  test("A + F — staff resolution requires an active takete membership", () => {
    // A Kogi Quest user has no app_memberships row for 'takete'; a suspended
    // treasurer has one whose status is not 'active'. Both are excluded by these
    // filters, before any role is read.
    const fn = AUTH_SOURCE.slice(
      AUTH_SOURCE.indexOf("export async function requireStaff"),
      AUTH_SOURCE.indexOf("export const FINANCIAL_MIN_ROLE"),
    );
    expect(fn).toContain('.from("app_memberships")');
    expect(fn).toContain('.eq("app_key", "takete")');
    expect(fn).toContain('.eq("status", "active")');
    // No membership => redirected out, rather than defaulted to a role.
    expect(fn).toMatch(/if \(!membership[\s\S]{0,60}redirect\(/);
  });

  test("A + F — the database helper applies the same conjunction independently", () => {
    // If the application check were ever bypassed, this is what still holds. It
    // is asserted here because 0019's policies delegate to it entirely: weaken
    // this helper and every contribution record opens up.
    const helper = BASE_MIGRATION.slice(
      BASE_MIGRATION.indexOf("function is_takete_financial_staff()"),
      BASE_MIGRATION.indexOf("alter table profiles enable row level security"),
    );
    expect(helper).toContain("app_memberships");
    expect(helper).toContain("app_key = 'takete'");
    expect(helper).toContain("status = 'active'");
    expect(helper).toContain("role in ('super_admin', 'treasurer')");
  });

  test("general Takete staff cannot read contribution records", () => {
    // is_takete_staff() is true for any active membership. Using it here would
    // expose every contributor's name, email and amount to editorial staff.
    expect(CONTRIBUTIONS_MIGRATION).not.toMatch(/using \(is_takete_staff\(\)\)/);
    expect(CONTRIBUTIONS_MIGRATION).not.toMatch(/using \(is_staff\(\)\)/);
  });
});

test.describe("Contribution table RLS", () => {
  test("RLS is enabled on both payment tables", () => {
    expect(CONTRIBUTIONS_MIGRATION).toContain("alter table contributions enable row level security");
    expect(CONTRIBUTIONS_MIGRATION).toContain("alter table payment_events enable row level security");
  });

  test("every policy delegates to the shared financial helper", () => {
    const policies = CONTRIBUTIONS_MIGRATION.match(/create policy[\s\S]*?;/g) ?? [];
    expect(policies.length).toBe(3);
    for (const policy of policies) {
      expect(policy, "every policy must be gated on financial staff").toContain(
        "is_takete_financial_staff()",
      );
    }
  });

  test("the predicate is not redefined locally", () => {
    // One definition, in the shared base. A second copy here would drift, and
    // the weaker of the two would win.
    expect(CONTRIBUTIONS_MIGRATION).not.toMatch(/create (or replace )?function is_takete_financial_staff/);
    expect(CONTRIBUTIONS_MIGRATION).not.toMatch(/create (or replace )?function is_financial_staff/);
  });

  test("no INSERT policy exists for anon, public or authenticated", () => {
    // With RLS on and no INSERT policy at all, no client-side role can create a
    // contribution row — the amount on that row is what verification later
    // compares the provider's figure against.
    expect(CONTRIBUTIONS_MIGRATION).not.toMatch(/for insert/i);
    expect(CONTRIBUTIONS_MIGRATION).not.toMatch(/\bto (anon|public|authenticated)\b/i);
    expect(CONTRIBUTIONS_MIGRATION).not.toMatch(/^\s*grant /im);
  });

  test("only the two approved tables are created", () => {
    const tables = [...CONTRIBUTIONS_MIGRATION.matchAll(/create table if not exists (\w+)/g)].map(
      (m) => m[1],
    );
    expect(tables.sort()).toEqual(["contributions", "payment_events"]);
    expect(CONTRIBUTIONS_MIGRATION).not.toContain("payment_transactions");
  });

  test("set_updated_at is used from the base migration, not redefined", () => {
    expect(BASE_MIGRATION).toContain("create or replace function set_updated_at()");
    expect(CONTRIBUTIONS_MIGRATION).toContain("execute function set_updated_at()");
    expect(CONTRIBUTIONS_MIGRATION).not.toMatch(/create (or replace )?function set_updated_at/);
  });
});

test.describe("Ledger reachability", () => {
  test("the contributions ledger is unreachable without a session", async ({ page }) => {
    await page.goto("/admin/contributions");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("the financial settings screen is likewise unreachable", async ({ page }) => {
    await page.goto("/admin/support");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
