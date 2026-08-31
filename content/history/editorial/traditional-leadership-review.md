# Traditional Leadership Review & Data Verification

**Status**: PENDING FORMAL VERIFICATION BY TRADITIONAL COUNCIL

---

## 1. Overview & Source Issue

The supplied historical manuscript (`takete-history-original.md`) provides a historical list of the past Olu'des of Takete-Ide, noting that political leadership resides in the Takete-Ide Traditional Council under the leadership of the Olu'de and his Council of Chiefs, with the present ruler, **Oba Philip Ebilakun**, noted as the **thirteenth (13th) Olu'de**.

However, the source document suffered text formatting corruption when pasted from a multi-column table into sequential plain text. The table headers (`NAME`, `FAMILY`, `WARD/COMPOUND`) are followed by three separate blocks of 12 entries each, rather than aligned rows.

**Policy**: Do **NOT** import these records into the Supabase database (`traditional_rulers` table) until they have been formally checked, aligned, and ratified by the Olu'de-in-Council and community historians.

---

## 2. Unaligned Raw Entries from Source

### List 1: Rulers (12 names)
1. Olude Opalu
2. Olude Ide
3. Olude Oriko
4. Olude Atte Gbogori
5. Olude Orunmbe
6. Olude Obadofin Obere
7. Olude Obaba Omologun
8. Olude Obajemu Atepa
9. Olude Elewa
10. Olude Obajemu Ate
11. Olude Alufa Olukotun
12. Olude J.A Fiki
*(13th: Oba Philip Ebilakun — current Olu'de)*

### List 2: Family Names (12 entries)
1. Atemayi
2. Eseyintelu
3. Oriko
4. Atemesami
5. Eseyintelu
6. Atemeji
7. Atemeto
8. Atemogbe
9. Eseyinmeleri
10. Atejagbo
11. Atejaba
12. Atemayi

### List 3: Wards / Compounds (12 entries)
1. Oke-Ako
2. Ile-Nla
3. Osikegun
4. Osikegun
5. Osikegun
6. Oketaro
7. Oke-oja
8. Oke-oja
9. Osikegun
10. Osikegun
11. Oketaro
12. Oke-Oja

---

## 3. Potential Row Reconstruction (Hypothesis Subject to Verification)

Assuming 1-to-1 sequential mapping from the original 3-column table:

| # | Name | Family (Hypothesized) | Ward / Compound (Hypothesized) | Status / Notes |
|---|------|-----------------------|--------------------------------|----------------|
| 1 | Olude Opalu | Atemayi | Oke-Ako | Unverified |
| 2 | Olude Ide | Eseyintelu | Ile-Nla | Unverified |
| 3 | Olude Oriko | Oriko | Osikegun | Unverified |
| 4 | Olude Atte Gbogori | Atemesami | Osikegun | Unverified |
| 5 | Olude Orunmbe | Eseyintelu | Osikegun | Unverified |
| 6 | Olude Obadofin Obere | Atemeji | Oketaro | Unverified |
| 7 | Olude Obaba Omologun | Atemeto | Oke-oja | Unverified |
| 8 | Olude Obajemu Atepa | Atemogbe | Oke-oja | Unverified |
| 9 | Olude Elewa | Eseyinmeleri | Osikegun | Unverified |
| 10 | Olude Obajemu Ate | Atejagbo | Osikegun | Unverified |
| 11 | Olude Alufa Olukotun | Atejaba | Oketaro | Unverified |
| 12 | Olude J.A. Fiki | Atemayi | Oke-Oja | Reigned 198×–200× (exact years missing) |
| 13 | Oba Philip Ebilakun | — | — | Current Olu'de (13th in line) |

---

## 4. Specific Items Requiring Verification

Before any ruler profiles or timeline cards are published on the website or stored in database tables:

1. **Reign Dates & Chronology**:
   - The manuscript lacks reign dates for rulers 1 through 11.
   - For Olude J.A. Fiki, the manuscript records placeholder years: `198× - 200×`. **Do not guess these years.** The exact ascension and transition years must be confirmed from official gazettes or council records.
   - For Oba Philip Ebilakun, exact date of installation and government grading status must be confirmed.
2. **Spelling & Titles**:
   - Check standard orthography for royal names (e.g. *Olu'de* vs *Olude*, *Atte* vs *Ate*, *Orunmbe* vs *Orunmbe*, *Obadofin Obere*).
3. **Compound & Family Associations**:
   - Confirm whether family lineages match the compounds listed (e.g., Atemayi in Oke-Ako and Oke-Oja; Osikegun occurrences).
4. **Alamuro Stool vs Olu'de Stool**:
   - Clarify the relationship and rotation between the town-level stool of Olu'de of Takete-Ide and the district-level paramount stool of Alamuro of Amuro (presently seated in Aiyedayo/Iloke, historically rotated among the 7 Amuro towns).
