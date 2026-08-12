# ADDITION — TAKETE-IDE ORÍKÌ, FAMILY NAMES & LINEAGE HERITAGE

Add a major cultural heritage feature dedicated to preserving the **Oríkì, family names, compounds, lineages and family histories of Takete-Ide Amuro**.

This is an important part of the Takete-Ide digital heritage project.

## CRITICAL RULE

Do NOT invent:

- family names
- compounds
- lineages
- Oríkì
- ancestral relationships
- founders
- migration stories
- family histories
- chieftaincy relationships
- praise names

Where verified information has not yet been supplied, build the complete system and show appropriate empty states.

All family and Oríkì information must eventually come from:

- recognised family representatives
- community elders
- traditional authorities
- documented family records
- oral-history interviews
- historical documents
- other approved community sources

---

# 1. CREATE A NEW MAIN SECTION

Add a primary navigation destination:

**Families & Oríkì**

Recommended public route:

`/families`

Also create:

`/oriki`

if separating the two experiences produces a better user experience.

A preferred structure is:

```text
/families
/families/[family-slug]
/oriki
/oriki/[slug]
```

The main navigation can show:

**Families & Oríkì**

and provide access to both sections.

---

# 2. PAGE TITLE

Create:

# Our Families & Oríkì

Suggested introduction:

**The story of Takete-Ide is also the story of its families. Across generations, family names, compounds, oral traditions and Oríkì have preserved identity, ancestry, values and collective memory. This digital archive is dedicated to documenting and preserving that heritage for future generations.**

---

# 3. FAMILY DIRECTORY

Create a searchable family directory.

Each verified family should eventually have its own profile.

Display family cards using:

- Family name
- Alternative spelling where applicable
- Compound or quarter
- Short introduction
- Family symbol or photograph if available
- Heritage verification status
- Link to full family profile

Provide:

- alphabetical browsing
- search
- compound filter
- family-name filter

Do not rank families.

Do not describe one family as more important than another.

---

# 4. FAMILY PROFILE

Each family should have a dedicated page.

Example route:

`/families/[family-slug]`

Support the following information.

## Family Name

Official/community-recognised name.

## Alternative Names

Alternative spellings or pronunciations where relevant.

## Compound

The traditional compound or geographical association.

## Family Oríkì

Written Oríkì where permission has been granted.

## Meaning and Interpretation

A carefully documented explanation of important phrases where knowledgeable community sources have provided one.

Do not automatically translate culturally significant expressions without appropriate source material.

## Oral Performance

Allow audio recordings of the Oríkì.

## Video

Allow video recordings where available.

## Family History

Document family history using verified or clearly labelled oral-history material.

## Known Ancestral Accounts

Present ancestral traditions carefully.

Use verification labels.

## Migration or Settlement History

Only publish when supplied by recognised sources.

## Family Values and Traditions

Allow families to document relevant customs and cultural practices.

## Historical Photographs

Family-contributed photographs.

## Documents

Relevant family records where permission allows publication.

## Notable Contributions to Takete-Ide

Allow documentation of contributions to:

- community development
- education
- traditional leadership
- public service
- agriculture
- business
- healthcare
- faith
- arts
- culture
- youth development

Do not turn this into an unverified list of famous people.

## Sources

Clearly identify sources supporting the family history.

---

# 5. ORÍKÌ DIGITAL ARCHIVE

Create:

`/oriki`

Page title:

# Oríkì of Takete-Ide

Supporting text:

**Preserving the praise poetry, ancestral expressions and oral traditions through which generations of Takete-Ide families have remembered identity, character and heritage.**

Create a visually rich but respectful archive.

Each Oríkì record should support:

- Title
- Family
- Compound
- Original language
- Written text
- Transliteration where relevant
- English interpretation where approved
- Cultural notes
- Performer/reciter
- Recording date
- Audio
- Video
- Transcript
- Source
- Contributor
- Verification status
- Publication permission
- Copyright/usage information

---

# 6. ORÍKÌ AUDIO

Audio should be a core part of the feature.

A written Oríkì alone cannot fully preserve:

- pronunciation
- rhythm
- tone
- emphasis
- performance style

Create an accessible audio player.

Display:

**Listen to the Oríkì**

Support:

- play
- pause
- progress
- duration
- playback speed if practical
- transcript

Do not autoplay audio.

---

# 7. ORÍKÌ VIDEO

Where community elders or family representatives agree, support video recording.

Display:

**Watch the Recitation**

Videos may document:

- Oríkì recitation
- explanation
- family history
- pronunciation
- cultural context

Provide captions or transcripts wherever practical.

---

# 8. ORIGINAL LANGUAGE FIRST

The original Oríkì should always be treated as the primary cultural record.

Where available, present content in this order:

### Original Oríkì

### Transliteration

### English Interpretation

### Cultural Explanation

Do not allow English translation to replace the original wording.

---

# 9. PRONUNCIATION

Create architecture for pronunciation recordings.

Family names and culturally significant terms may have audio buttons.

Example:

**Omọ́…** 🔊

Users should be able to hear the correct community pronunciation.

This is especially valuable for younger Takete-Ide people growing up outside the community.

---

# 10. COMPOUNDS

Create a structured **Compounds of Takete-Ide** section.

Recommended route:

`/families/compounds`

Each compound may eventually contain:

- name
- alternative name
- description
- associated families
- historical information
- photographs
- oral accounts
- approximate location
- verification status

Do not publish precise private residential locations.

---

# 11. FAMILY RELATIONSHIPS

Design the database so relationships between families or branches can be recorded where historically appropriate.

Possible relationships:

- parent lineage
- branch
- related family
- historical association

Do NOT automatically generate genealogical relationships.

Only administrators/archivists should create these relationships using verified information.

---

# 12. FAMILY TREE CAPABILITY

Prepare the architecture for future family-tree functionality.

Do not make private living-person genealogy publicly accessible by default.

Historical family trees may eventually display:

```text
Ancestor
   ↓
Family Branches
   ↓
Sub-branches
```

Living persons require appropriate privacy controls and consent.

---

# 13. PRIVACY

Family heritage information can contain personal information.

Apply strong privacy controls.

Do not publicly expose:

- private addresses
- telephone numbers
- personal email addresses
- dates of birth of living persons
- sensitive family disputes
- private genealogy
- unverified parentage
- information supplied confidentially

Historical preservation must not override personal privacy.

---

# 14. FAMILY DISPUTES

The website must NOT become a platform for resolving lineage disputes.

If competing historical accounts exist:

Present them neutrally.

Example:

**Community oral accounts differ regarding this aspect of the family's early history. Further documentation is being collected.**

Never allow the system or AI-generated content to decide which family account is correct.

Refer disputed heritage information for community review.

---

# 15. VERIFICATION SYSTEM

Extend the historical verification system to family content.

Statuses:

### Draft

Information being prepared.

### Family Submitted

Information supplied by a recognised family representative.

### Oral History

Information supported primarily through oral testimony.

### Documentary Evidence

Supporting written/documentary evidence exists.

### Community Reviewed

Reviewed by designated community historians or elders.

### Verified

Approved through the project's agreed verification process.

### Disputed

Material contains competing accounts requiring further review.

Never automatically convert submitted material to Verified.

---

# 16. FAMILY REPRESENTATIVES

Allow authorised administrators to assign an approved:

**Family Representative**

This person may submit or recommend corrections to the family's profile.

Do NOT automatically give public registrants editing permissions.

All changes go through editorial review.

---

# 17. COMMUNITY SUBMISSION

Create:

`/families/contribute`

Title:

# Help Preserve Your Family History

Allow Takete-Ide families to submit information.

Form fields:

- Family name
- Compound
- Submitter name
- Relationship to family
- Email
- Telephone — optional
- Family history
- Oríkì
- Explanation of Oríkì
- Names of knowledgeable elders
- Supporting documents
- Historical photographs
- Audio recording
- Video recording
- Source information
- Permission to archive material
- Permission to publish material
- Additional notes

Submission must go into a review queue.

Nothing publishes automatically.

---

# 18. ORÍKÌ SUBMISSION

Create:

`/oriki/contribute`

Allow community members to submit:

- family
- Oríkì title
- written Oríkì
- audio
- video
- reciter
- explanation
- source
- recording date
- consent
- publication permission

Administrators must review before publication.

---

# 19. RECORD OUR ELDERS

Connect this feature to:

**Voices of Takete-Ide**

Encourage oral-history recordings with elders who know:

- family histories
- Oríkì
- compounds
- migration accounts
- traditional names
- praise names
- historical personalities
- important events
- cultural customs

Create cross-links between:

Oral History → Family → Oríkì → Historical Event.

---

# 20. FAMILY NAME INDEX

Create:

# Takete-Ide Family Names

Provide an alphabetical index.

Example layout only:

```text
A
Family records beginning with A

B
Family records beginning with B

D
Family records beginning with D
```

Do not populate examples with invented Takete-Ide surnames.

Only use supplied and verified names.

---

# 21. SEARCH

Extend site-wide search to include:

- family names
- alternative spellings
- compounds
- Oríkì
- historical people
- oral histories
- archive records

A diaspora member should eventually be able to search their family name and discover available heritage records.

---

# 22. CROSS-LINKING

Create intelligent internal relationships.

Example:

A family profile may link to:

**Associated Oríkì**

**Oral Histories**

**Historical Photographs**

**Takete-Ide Day Records**

**Archive Documents**

**Community Profiles**

**Compound**

This should create a connected digital heritage archive rather than isolated pages.

---

# 23. DATABASE

Add appropriate entities such as:

```text
families
family_aliases
compounds
family_compounds
family_histories
family_relationships
family_media
family_sources
oriki
oriki_transcripts
oriki_translations
oriki_media
oriki_sources
family_representatives
heritage_submissions
heritage_reviews
```

Suggested `families` fields:

```text
id
name
slug
alternative_names
summary
history
compound_id
verification_status
publication_status
created_at
updated_at
created_by
reviewed_by
```

Suggested `oriki` fields:

```text
id
family_id
title
slug
original_text
transliteration
english_interpretation
cultural_notes
language
verification_status
publication_status
created_at
updated_at
```

Normalise the schema properly rather than blindly following this example.

---

# 24. MEDIA STORAGE

Create organised storage paths.

Example:

```text
families/
  [family-id]/
    photos/
    documents/
    audio/
    video/

oriki/
  [oriki-id]/
    audio/
    video/
    documents/
```

Validate uploads.

Preserve original archival files where practical while generating optimised web copies.

---

# 25. ADMIN

Add:

`Admin → Heritage → Families`

`Admin → Heritage → Compounds`

`Admin → Heritage → Oríkì`

`Admin → Heritage → Submissions`

`Admin → Heritage → Verification`

Allow archivists to:

- create family profiles
- edit family profiles
- attach sources
- upload images
- upload audio
- upload video
- add Oríkì
- connect oral-history records
- record alternative accounts
- flag disputes
- submit for verification

---

# 26. REVIEW WORKFLOW

Recommended workflow:

```text
Community Submission
        ↓
Archivist Review
        ↓
Source Check
        ↓
Family Representative Review
        ↓
Community/Historical Review
        ↓
Approved for Publication
```

Not every stage needs to be mandatory technically, but the system should support this workflow.

---

# 27. FAMILY PROFILE DESIGN

Create a dignified visual design.

Possible structure:

```text
------------------------------------------------
             FAMILY NAME
       Takete-Ide Amuro Heritage
------------------------------------------------

[Family / historical photograph]

About the Family

Family Oríkì
[Listen ▶]

Original Text

Interpretation

Family History

Compound

Historical Timeline

Photo Archive

Oral Histories

Sources & Verification
------------------------------------------------
```

Do not design the pages like commercial business listings.

These are cultural heritage records.

---

# 28. ORÍKÌ PAGE DESIGN

Create an immersive but simple presentation.

Example:

```text
------------------------------------------------
              ORÍKÌ
       [Family / Lineage Name]

           ▶ Listen

      Original Recitation

         Oríkì text...

------------------------------------------------

Meaning & Interpretation

Cultural Context

About the Family

Recorded By

Sources

Verification
------------------------------------------------
```

Use subtle Takete purple and heritage gold.

Prioritise the words and voice over decorative elements.

---

# 29. HOMEPAGE FEATURE

Add a homepage section:

# Our Families. Our Stories.

Supporting copy:

**Family names and Oríkì carry generations of Takete-Ide memory. Explore the families, compounds, voices and traditions that form our shared heritage.**

Buttons:

**Explore Our Families**

**Discover Oríkì**

Use heritage photography if appropriate.

Do not show arbitrary families as more prominent than others unless administrators deliberately feature them.

---

# 30. HERITAGE PAGE

Add prominent cards under `/heritage`:

### Our Families

**Discover the families and compounds that form the Takete-Ide community.**

### Our Oríkì

**Listen to and preserve the praise poetry and oral traditions passed from generation to generation.**

### Voices of Takete-Ide

**Hear community history from those who carry its memory.**

---

# 31. DIGITAL ARCHIVE

Family and Oríkì records must integrate with the main Digital Archive.

Users should be able to filter archival material by:

- Family
- Compound
- Year
- Content Type
- Person
- Event
- Verification Status

---

# 32. FAMILY PHOTOGRAPHS

Enable families to contribute historical photographs.

Require:

- approximate date
- people shown if known
- event if known
- photographer if known
- contributor
- family
- description
- publication permission

Do not require identification where information has been lost.

Allow:

**Unknown / To be identified**

This may help community members later identify people in old photographs.

---

# 33. “CAN YOU IDENTIFY THIS?” ARCHIVE FEATURE

Prepare an optional heritage feature:

# Help Us Identify Our History

Administrators may publish selected historical photographs where:

- people are unidentified
- dates are uncertain
- events are unknown

Community members can submit suggestions.

Suggestions must require moderation before becoming part of the official archive.

---

# 34. GENERATIONAL PRESERVATION

Design this feature with a long-term objective:

A Takete-Ide child born anywhere in the world should eventually be able to visit the website, search their family name, learn its history, hear its correct pronunciation, listen to its Oríkì, view historical photographs and understand how that family connects to the broader history of Takete-Ide Amuro.

This is a core success criterion for the website.

---

# 35. CULTURAL RESPECT

Treat Oríkì as cultural heritage rather than decorative website copy.

Do not:

- shorten it automatically
- rewrite it for marketing
- modernise the language without approval
- generate missing verses with AI
- merge separate family Oríkì
- infer relationships from similar names

Preserve supplied wording exactly in the archival record.

Edited translations or explanatory notes must be stored separately from the original.

---

# 36. FINAL REQUIREMENT

Integrate **Families & Oríkì** throughout the Takete-Ide website rather than treating it as an isolated extra page.

The finished platform should connect:

**Takete-Ide**
→ **Community**
→ **Family**
→ **Compound**
→ **Oríkì**
→ **Oral History**
→ **People**
→ **Photographs**
→ **Documents**
→ **Events**
→ **Development**

Build the database and CMS so these records can grow gradually as elders, families and community members provide verified information.

Do not ask the project owner to provide all family names or Oríkì before development begins.

Build the complete feature now, use appropriate empty states for missing content, and make the website ready for authorised community contributors to populate the archive later.