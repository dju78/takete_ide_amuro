/**
 * Official Guests, Hosts, Launchers and Royal Dignitaries for the
 * Takete-Ide Centenary Celebration 2026.
 *
 * Primary Source of Truth: Official Takete-Ide Centenary 2026 Invitation artwork.
 * Source Organisation: The Takete-Ide Progressive Union (TIPU).
 * Event Year: 2026.
 * Source Type: official-invitation.
 */

export interface CentenaryGuest {
  id: string;
  name: string;
  role?: string;
  category: CentenaryGuestCategory;
  categoryLabel: string;
  isGroup?: boolean;
  isProminent?: boolean;
  sourceType: "official-invitation";
  sourceOrganisation: "Takete-Ide Progressive Union";
  eventYear: 2026;
}

export type CentenaryGuestCategory =
  | "distinguished_special_guest"
  | "special_guests_of_honour"
  | "chairman_of_the_day"
  | "lady_chairman"
  | "chief_launcher"
  | "co_launchers"
  | "special_hosts"
  | "special_royal_guest"
  | "special_royal_hosts"
  | "royal_guest"
  | "royal_host"
  | "chief_hosts";

export interface CentenaryGuestGroup {
  category: CentenaryGuestCategory;
  title: string;
  eyebrow?: string;
  description?: string;
  items: CentenaryGuest[];
}

export interface CentenaryRSVPContact {
  id: string;
  phone: string;
  displayPhone: string;
}

/**
 * Official RSVP contact numbers published on the official invitation.
 * "For enquiries, confirmations, sponsorships, and participation, kindly contact:"
 */
export const CENTENARY_RSVP_CONTACTS: CentenaryRSVPContact[] = [
  {
    id: "rsvp-1",
    phone: "+2348163376331",
    displayPhone: "08163376331",
  },
  {
    id: "rsvp-2",
    phone: "+2348050724351",
    displayPhone: "08050724351",
  },
  {
    id: "rsvp-3",
    phone: "+2348038308369",
    displayPhone: "08038308369",
  },
  {
    id: "rsvp-4",
    phone: "+2348038862295",
    displayPhone: "08038862295",
  },
];

/**
 * Official guest and host records strictly verified against the official invitation artwork.
 * Category = Invitation Category.
 * Role = Professional / Official occupational description printed underneath name.
 */
export const CENTENARY_GUESTS: CentenaryGuest[] = [
  // 1. Distinguished Special Guest of Honour (1 individual)
  {
    id: "guest-ododo",
    name: "His Excellency Alh. Ahmed Usman Ododo, FCA",
    role: "The Chief Servant of Kogi State",
    category: "distinguished_special_guest",
    categoryLabel: "Distinguished Special Guest of Honour",
    isProminent: true,
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },

  // 2. Special Guests of Honour (6 individuals)
  {
    id: "guest-karimi",
    name: "Distinguished Senator Sunday Karimi",
    role: "Senator Representing Kogi West Senatorial District",
    category: "special_guests_of_honour",
    categoryLabel: "Special Guest of Honour",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
  {
    id: "guest-faleke",
    name: "Hon. James Abiodun Faleke",
    role: "Member Representing Ikeja Federal Constituency",
    category: "special_guests_of_honour",
    categoryLabel: "Special Guest of Honour",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
  {
    id: "guest-abejide",
    name: "Hon. Leke Abejide",
    role: "Member Representing Yagba Federal Constituency",
    category: "special_guests_of_honour",
    categoryLabel: "Special Guest of Honour",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
  {
    id: "guest-salman",
    name: "Hon. Salman Idris",
    role: "Member Representing Kabba/Bunu/Ijumu Federal Constituency",
    category: "special_guests_of_honour",
    categoryLabel: "Special Guest of Honour",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
  {
    id: "guest-olatunji",
    name: "Prince Olusoji Olatunji",
    role: "Chairman, Grosvenor Group",
    category: "special_guests_of_honour",
    categoryLabel: "Special Guest of Honour",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
  {
    id: "guest-onumoko",
    name: "Hajia Habibat Onumoko",
    role: "Kogi State Accountant General",
    category: "special_guests_of_honour",
    categoryLabel: "Special Guest of Honour",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },

  // 3. Chairman of the Day (1 individual)
  {
    id: "guest-nasir",
    name: "Professor Nasir Naeem Abdulsalam",
    role: "Managing Director, Ajaokuta Steel Company Limited",
    category: "chairman_of_the_day",
    categoryLabel: "Chairman of the Day",
    isProminent: true,
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },

  // 4. Lady Chairman (1 individual)
  {
    id: "guest-omole",
    name: "Chief Mrs. Toyin Omole",
    role: "Business Tycoon",
    category: "lady_chairman",
    categoryLabel: "Lady Chairman",
    isProminent: true,
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },

  // 5. Chief Launcher (1 individual)
  {
    id: "guest-adedayo",
    name: "Dr. Korede Adedayo, FCIB",
    role: "Chairman and CEO, First Trust Mortgage Bank Plc",
    category: "chief_launcher",
    categoryLabel: "Chief Launcher",
    isProminent: true,
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },

  // 6. Co-Launchers (5 individuals)
  {
    id: "guest-mangal",
    name: "Engr. Fahad Mangal",
    role: "Managing Director, Mangal Cement Company",
    category: "co_launchers",
    categoryLabel: "Co-Launcher",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
  {
    id: "guest-olarunisola",
    name: "Chief Dr. Yomi Charles Olarunisola",
    role: "Chairman, Absolute Group, Abuja",
    category: "co_launchers",
    categoryLabel: "Co-Launcher",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
  {
    id: "guest-abubakar",
    name: "Hon. Engr. Bashir Abubakar (Gegu)",
    role: "Kogi State Commissioner for Solid Minerals and Natural Resources",
    category: "co_launchers",
    categoryLabel: "Co-Launcher",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
  {
    id: "guest-asiru",
    name: "Mukadam Asiwaju Idris Asiru",
    role: "Kogi State Commissioner for Finance, Budget and Economic Planning",
    category: "co_launchers",
    categoryLabel: "Co-Launcher",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
  {
    id: "guest-idachaba",
    name: "Engr. Friday Idachaba",
    role: "Business Mogul",
    category: "co_launchers",
    categoryLabel: "Co-Launcher",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },

  // 7. Special Hosts (2 individuals)
  {
    id: "guest-bello",
    name: "Hon. Ademola Bello",
    role: "Executive Chairman, Mopamuro Local Government Area",
    category: "special_hosts",
    categoryLabel: "Special Host",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
  {
    id: "guest-jacob",
    name: "Hon. Olawumi Jacob",
    role: "Member Rep. Mopamuro Constituency, Kogi State House of Assembly",
    category: "special_hosts",
    categoryLabel: "Special Host",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },

  // 8. Special Royal Guest (1 individual)
  {
    id: "royal-owoniyi",
    name: "HRM Oba Solomon Owoniyi",
    role: "The Obaro of Kabba and Chairman, Okun Area Traditional Council",
    category: "special_royal_guest",
    categoryLabel: "Special Royal Guest",
    isProminent: true,
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },

  // 9. Special Royal Hosts (2 individuals)
  {
    id: "royal-ibeun",
    name: "HRM Oba Muyiwa Ibeun",
    role: "The Elulu of Mopa and Chairman, Mopamuro LGA Traditional Council",
    category: "special_royal_hosts",
    categoryLabel: "Special Royal Host",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
  {
    id: "royal-ayedogbon",
    name: "HRM Engr. Alfred Modupe Ayedogbon",
    role: "The Alamuro of Amuro and Vice Chairman, Mopamuro LGA Traditional Council",
    category: "special_royal_hosts",
    categoryLabel: "Special Royal Host",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },

  // 10. Royal Guest (1 individual + 1 group statement)
  {
    id: "royal-ayo",
    name: "HRH Ambassador Dr. Tolorunjuwon L. Ayo",
    role: "The Olu Agba III of Makutu, Isanlu",
    category: "royal_guest",
    categoryLabel: "Royal Guest",
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
  {
    id: "royal-council",
    name: "All Members of the Mopamuro Traditional Council",
    category: "royal_guest",
    categoryLabel: "Royal Guests",
    isGroup: true,
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },

  // 11. Royal Host (1 individual)
  {
    id: "royal-ebilakun",
    name: "HRH Oba Philip Ebilakun",
    role: "The Olu'de of Takete Ide, Amuro",
    category: "royal_host",
    categoryLabel: "Royal Host",
    isProminent: true,
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },

  // 12. Chief Hosts (2 individuals)
  {
    id: "host-fiki",
    name: "Prince (Buldr) Richard Fiki",
    role: "National President, Takete-Ide Progressive Union (TIPU)",
    category: "chief_hosts",
    categoryLabel: "Chief Host",
    isProminent: true,
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
  {
    id: "host-fanwo",
    name: "Hon. Kingsley Femi Fanwo",
    role: "Kogi State Commissioner for Information and Communications",
    category: "chief_hosts",
    categoryLabel: "Chief Host",
    isProminent: true,
    sourceType: "official-invitation",
    sourceOrganisation: "Takete-Ide Progressive Union",
    eventYear: 2026,
  },
];

/**
 * Programmatic breakdown of guest and host entries.
 */
export const INDIVIDUAL_GUEST_COUNT = CENTENARY_GUESTS.filter((g) => !g.isGroup).length;
export const GROUP_ENTITY_COUNT = CENTENARY_GUESTS.filter((g) => g.isGroup).length;
export const TOTAL_RECORD_COUNT = CENTENARY_GUESTS.length;

/**
 * Groups guests and hosts into structured display sections.
 */
export function getGroupedCentenaryGuests(): CentenaryGuestGroup[] {
  const categories: {
    category: CentenaryGuestCategory;
    title: string;
    eyebrow?: string;
    description?: string;
  }[] = [
    {
      category: "distinguished_special_guest",
      title: "Distinguished Special Guest of Honour",
      eyebrow: "Special Guest of Honour",
    },
    {
      category: "special_guests_of_honour",
      title: "Special Guests of Honour",
      eyebrow: "Distinguished Leaders",
    },
    {
      category: "chairman_of_the_day",
      title: "Chairman of the Day",
      eyebrow: "Presiding Leadership",
    },
    {
      category: "lady_chairman",
      title: "Lady Chairman",
      eyebrow: "Presiding Leadership",
    },
    {
      category: "chief_launcher",
      title: "Chief Launcher",
      eyebrow: "Development Fundraising",
    },
    {
      category: "co_launchers",
      title: "Co-Launchers",
      eyebrow: "Development Fundraising",
    },
    {
      category: "special_royal_guest",
      title: "Special Royal Guest",
      eyebrow: "Traditional Institution",
    },
    {
      category: "special_royal_hosts",
      title: "Special Royal Hosts",
      eyebrow: "Traditional Institution",
    },
    {
      category: "royal_guest",
      title: "Royal Guests",
      eyebrow: "Traditional Institution",
    },
    {
      category: "royal_host",
      title: "Royal Host",
      eyebrow: "Traditional Host",
    },
    {
      category: "special_hosts",
      title: "Special Hosts",
      eyebrow: "Local Government & State Leadership",
    },
    {
      category: "chief_hosts",
      title: "Chief Hosts",
      eyebrow: "Community & State Leadership",
    },
  ];

  return categories
    .map((cat) => ({
      ...cat,
      items: CENTENARY_GUESTS.filter((g) => g.category === cat.category),
    }))
    .filter((g) => g.items.length > 0);
}
