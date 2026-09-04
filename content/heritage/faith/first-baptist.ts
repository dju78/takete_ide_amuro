export interface BaptistFounder {
  name: string;
  role: string;
  notes?: string;
}

export interface BaptistLeader {
  name: string;
  role: string;
  period?: string;
  notes?: string;
}

export const FIRST_BAPTIST_HISTORY = {
  title: "First Baptist Church, Takete-Ide",
  subtitle: "The birth and growth of the Baptist Mission in Takete-Ide",
  establishedDate: "November 1922",
  founders: [
    { name: "Pa Joash Agunbiade", role: "Founder & Baba Egbe", notes: "Led the group that embraced the Baptist Mission." },
    { name: "Pa Luke Olorunleke", role: "Founder & Church Leader", notes: "Served as early Church Leader." },
    { name: "Pa Paul Amora", role: "Founder", notes: "Co-founded the congregation with the cooperation of his wife." },
    { name: "Pa Saul Akedi", role: "Founder (Baba Eleahy)", notes: "Spelling noted in manuscript as Baba Eleahy / Eleah." },
    { name: "Pa Noah Omoyele", role: "Founder", notes: "Listed among the six founders; subsequent passage mentions Noah Eseyin as Secretary." },
    { name: "Pa Alfred Eseyin", role: "Founder (Baba Owa)", notes: "Last surviving founding member; renowned for deep spiritual devotion." },
  ],
  earlyPastors: [
    { name: "Rev. Margi", role: "Visiting Baptist Minister", period: "c. 1924", notes: "An Igede Baptist minister who visited regularly for one to two weeks at a time, sleeping inside the auditorium." },
    { name: "Rev. Agbode", role: "First Resident Pastor", period: "1925", notes: "From Igede; first official resident pastor of the church." },
    { name: "Pastor Olaleken", role: "Early Pastor", notes: "Spelling subject to confirmation from church registers." },
    { name: "Pastor David Otitodun", role: "Early Pastor", notes: "Served in pastoral leadership." },
    { name: "Pastor Adeosun", role: "Early Pastor", notes: "Served in pastoral leadership." },
    { name: "Pastor Ajibade", role: "Teacher-Pastor", notes: "Primary-school teacher posted from Oyo State who served the church." },
    { name: "Pastor Falana", role: "Teacher-Pastor", notes: "Primary-school teacher posted from Ekirin-Adde who served the church." },
    { name: "Pastor Adetunji", role: "Student Pastor", notes: "Student pastor from Saki in Oyo State who served for three months." },
  ],
  modernPastors: [
    { name: "HRH Oba Philip Ebilakun", role: "Church Pastor", period: "1982–1985 & 1988–1990", notes: "The reigning Olude of Takete-Ide served twice as Church Pastor." },
    { name: "Rev. Oyekunle", role: "Church Pastor", period: "1985–1988", notes: "Served between Oba Ebilakun's pastoral tenures." },
    { name: "Rev. Agbogun", role: "Church Pastor", period: "Inducted August 1990; Ordained 14 November 1990", notes: "Served up to the period recorded in the supplied manuscript." },
  ],
  laterLeaders: [
    "Pa Raphael Elewa",
    "Pa Thomas Eleah",
    "Pa Gideon Eleah",
    "Pa Timothy Adetimoyo",
    "Pa David Olorunleke",
    "Pa Akin Eseyin",
    "Chief Reuben Eleah",
    "Chief Matthew Igunrin Ayedogbon",
    "Pa Mark Agunbiade",
  ],
  verificationNotes: [
    "The founders' list names Pa Noah Omoyele, while a following paragraph identifies Noah Eseyin as Church Secretary.",
    "Confirm the spellings of Baba Eleahy, Pastor Olaleken, Pa Timothy Adetimoyo and Chief Matthew Igunrin Ayedogbon.",
    "Confirm the spelling of Baba Ajayi Yeloyejo and the boundary name Pa Elehire.",
    "Record the exact date on which the original church history manuscript was compiled, particularly regarding the 'till date' reference for Rev. Agbogun.",
  ],
};
