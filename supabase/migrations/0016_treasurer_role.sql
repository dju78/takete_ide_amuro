-- 0016: A `treasurer` role for financial administration.
--
-- Editing the public contribution account is not ordinary content editing. A
-- wrong account number sends community money to a stranger, so the permission
-- has to be narrower than "administrator" — but restricting it to `super_admin`
-- alone would mean the person who actually manages the union's finances could
-- not maintain it.
--
-- `treasurer` therefore sits alongside the existing roles. It is *not* ranked
-- above administrator for general content: lib/auth.ts gives it the same
-- ordinary-content rank as the other specialists, and the financial screens
-- check for it explicitly (requireFinancialAdmin) rather than by rank. That
-- keeps a treasurer out of unrelated admin areas.

alter type takete_role add value if not exists 'treasurer';
