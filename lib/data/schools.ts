import { getPublicSupabase } from "@/lib/supabase/server";
import type { School, VerificationStatus } from "@/types/content";

const VERIFIED_HISTORICAL_SCHOOLS: School[] = [
  {
    id: "gdss-takete-ide",
    name: "Government Day Secondary School, Takete-Ide",
    slug: "gdss-takete-ide",
    school_type: "public",
    level: "secondary",
    location: "Takete-Ide, Mopamuro LGA, Kogi State",
    year_established: null,
    establishment_milestones: [
      { label: "Community Resolution (AGM)", year: "26 Dec 1975" },
      { label: "Teaching Commenced", year: "Jan 1977" },
      { label: "Government Takeover (Oyi LGA)", year: "1980" },
    ],
    historical_description:
      "Initiated as a community self-funded secondary school by resolution at the TIPU Annual General Meeting on 26 December 1975; pioneer teaching commenced in January 1977. Officially taken over by the defunct Oyi Local Government in 1980, becoming Government Day Secondary School (GDSS), Takete-Ide. Pioneer principal: Chief Kayode Fanwo.",
    current_head: null,
    approximate_enrolment: null,
    facilities: [
      "Classroom Blocks",
      "Universal Basic Education (UBE) Junior Block",
      "School Assembly Grounds",
    ],
    community_needs: [
      "Classroom Refurbishment",
      "Instructional Materials Support",
    ],
    current_projects: [],
    photographs: [
      "/images/takete-ide/places/gdss-takete-ide.jpg",
    ],
    source_title: "From the Hilltops to the Valley: A Historical Account of Takete-Ide",
    source_author: "Community Historical Document",
    source_date: "Approved Historical Account",
    verified_by: "Community Historical Record",
    last_verified_at: "2026-01-15",
    verification_status: "verified",
    status: "published",
    display_order: 1,
  },
  {
    id: "lgea-primary-takete-ide",
    name: "L.G.E.A. Primary School, Takete-Ide",
    slug: "lgea-primary-takete-ide",
    school_type: "public",
    level: "primary",
    location: "Takete-Ide, Mopamuro LGA, Kogi State",
    year_established: null,
    establishment_milestones: [
      { label: "S.I.M Classes Commenced", year: "1943" },
      { label: "Native Authority Expansion", year: "1953" },
      { label: "Full Primary Approval", year: "1958" },
    ],
    historical_description:
      "Primary classes commenced in 1943 under S.I.M with Pa Samuel Bamidele Makanjuola as pioneer teacher. Expanded under Native Authority administration in 1953 and received official approval as a full primary school in 1958, presently operating as L.G.E.A. Primary School.",
    current_head: null,
    approximate_enrolment: null,
    facilities: [
      "Primary Classroom Blocks",
      "School Grounds",
    ],
    community_needs: [
      "Classroom Maintenance",
      "Primary Learning Materials",
    ],
    current_projects: [],
    photographs: [],
    source_title: "From the Hilltops to the Valley: A Historical Account of Takete-Ide",
    source_author: "Community Historical Document",
    source_date: "Approved Historical Account",
    verified_by: "Community Historical Record",
    last_verified_at: "2026-01-15",
    verification_status: "verified",
    status: "published",
    display_order: 2,
  },
  {
    id: "christ-nursery-primary-takete-ide",
    name: "Christ Nursery & Primary School, Takete-Ide",
    slug: "christ-nursery-primary-takete-ide",
    school_type: "mission",
    level: "nursery_primary",
    location: "Takete-Ide, Mopamuro LGA, Kogi State",
    year_established: null,
    establishment_milestones: [
      { label: "ECWA Church Establishment", year: "2001" },
      { label: "Government Approval", year: "2002" },
    ],
    historical_description:
      "Established by the ECWA Church in 2001 to provide early childhood and nursery/primary education, receiving official approval in 2002.",
    current_head: null,
    approximate_enrolment: null,
    facilities: [
      "Nursery & Primary Learning Blocks",
    ],
    community_needs: [
      "Early Childhood Learning Resources",
    ],
    current_projects: [],
    photographs: [],
    source_title: "From the Hilltops to the Valley: A Historical Account of Takete-Ide",
    source_author: "Community Historical Document",
    source_date: "Approved Historical Account",
    verified_by: "Community Historical Record",
    last_verified_at: "2026-01-15",
    verification_status: "verified",
    status: "published",
    display_order: 3,
  },
  {
    id: "digital-economy-centre-takete-ide",
    name: "Digital Learning & Economy Project (NCC)",
    slug: "digital-economy-centre-takete-ide",
    school_type: "community",
    level: "vocational",
    location: "Takete-Ide, Mopamuro LGA, Kogi State",
    year_established: null,
    establishment_milestones: [
      { label: "Federal Government / NCC Intervention", year: "Documented" },
    ],
    historical_description:
      "Federal Government and Nigerian Communications Commission (NCC) digital infrastructure intervention, providing computers and ICT learning facilities for junior secondary pupils and community students.",
    current_head: null,
    approximate_enrolment: null,
    facilities: [
      "Computer Workstations",
      "Digital Learning Space",
    ],
    community_needs: [
      "Workstation Maintenance & Upgrades",
    ],
    current_projects: [],
    photographs: [
      "/images/takete-ide/education/digital-economy-centre.png",
    ],
    source_title: "From the Hilltops to the Valley: A Historical Account of Takete-Ide",
    source_author: "Community Infrastructure Records",
    source_date: null,
    verified_by: "Community Infrastructure Record",
    last_verified_at: null,
    verification_status: "community_record",
    status: "published",
    display_order: 4,
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSchool(row: any): School {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    school_type: row.school_type || "public",
    level: row.level || "secondary",
    location: row.location || "Takete-Ide",
    year_established: row.year_established != null ? Number(row.year_established) : null,
    historical_description: row.historical_description,
    current_head: row.current_head,
    approximate_enrolment: row.approximate_enrolment != null ? Number(row.approximate_enrolment) : null,
    facilities: Array.isArray(row.facilities) ? row.facilities : [],
    community_needs: Array.isArray(row.community_needs) ? row.community_needs : [],
    current_projects: Array.isArray(row.current_projects) ? row.current_projects : [],
    photographs: Array.isArray(row.photographs) ? row.photographs : [],
    source_title: row.source_title,
    source_author: row.source_author,
    source_date: row.source_date,
    verified_by: row.verified_by,
    last_verified_at: row.last_verified_at,
    verification_status: (row.verification_status as VerificationStatus) || "community_record",
    status: row.status || "published",
    display_order: row.display_order ?? 0,
  };
}

export async function getSchools(): Promise<School[]> {
  const supabase = getPublicSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(mapSchool);
    }
  }

  // Graceful fallback to verified historical dataset
  return VERIFIED_HISTORICAL_SCHOOLS;
}

export async function getSchoolBySlug(slug: string): Promise<School | null> {
  const supabase = getPublicSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) return mapSchool(data);
  }

  return VERIFIED_HISTORICAL_SCHOOLS.find((s) => s.slug === slug) ?? null;
}
