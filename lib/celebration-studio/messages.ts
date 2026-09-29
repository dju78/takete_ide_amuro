export interface PresetMessage {
  id: string;
  category: "celebration" | "felicitation" | "heritage" | "patriotism" | "family";
  text: string;
}

export const APPROVED_MESSAGES: PresetMessage[] = [
  {
    id: "msg-1",
    category: "celebration",
    text: "Celebrating 100 years of heritage, unity and progress.",
  },
  {
    id: "msg-2",
    category: "felicitation",
    text: "Warm congratulations to the people of Takete-Ide on this historic centenary.",
  },
  {
    id: "msg-3",
    category: "heritage",
    text: "Honouring our heritage and celebrating a century of community.",
  },
  {
    id: "msg-4",
    category: "patriotism",
    text: "Long live Takete-Ide. Long live our unity and progress.",
  },
  {
    id: "msg-5",
    category: "celebration",
    text: "Joyfully celebrating a century of resilience, fellowship and cultural excellence in Takete-Ide.",
  },
  {
    id: "msg-6",
    category: "family",
    text: "Our family rejoices with our royal father, elders, sons and daughters on this historic centenary milestone.",
  },
  {
    id: "msg-7",
    category: "heritage",
    text: "From the hilltops to the valley, our roots run deep and our future shines bright.",
  },
];

export const APPROVED_LOCAL_EXPRESSIONS: string[] = [
  "Agbagba Ide Agbe Wa O",
  "A Century of Heritage · A Future of Greater Glory",
  "Omo Takete-Ide Ni Mi",
  "Takete-Ide A Gbe Wa O",
  "Faith, Unity and Progress",
];

export const APPROVED_GREETINGS: string[] = [
  "Happy Centenary Celebration!",
  "Warm Felicitations!",
  "Hearty Congratulations!",
  "Centenary Greetings!",
  "A Historic Milestone!",
];
