export const audienceStorageKey = "hbi-visitor-path";
export const audienceChangeEvent = "hbi-audience-change";

export type AudienceId =
  | "overview"
  | "student"
  | "educator"
  | "partner"
  | "supporter"
  | "technology";

export type AudiencePath = {
  id: AudienceId;
  label: string;
  detail: string;
  kicker: string;
  headline: string[];
  intro: string;
  tags: string[];
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  stats: { value: string; label: string }[];
  message: string;
  links: readonly (readonly [string, string])[];
};

export const audiencePaths: AudiencePath[] = [
  {
    id: "overview",
    label: "Explore all",
    detail: "The complete HBI ecosystem",
    kicker: "AI-first innovation · Emerging technology · Community impact",
    headline: ["Turning emerging", "technology into", "real-world", "opportunity."],
    intro:
      "HBIVentures connects education, industry, and community to turn emerging technology into practical products, future-ready skills, and more equitable opportunity.",
    tags: ["Artificial Intelligence", "Smart Cities", "Connected Car", "IoT", "Data Science"],
    primary: { label: "Explore Our Work", href: "#pillars" },
    secondary: { label: "Partner With HBI", href: "/contact" },
    stats: [
      { value: "320+", label: "Students Served" },
      { value: "80+", label: "Student Prototypes" },
      { value: "Since 2016", label: "Creating Impact" },
    ],
    message: "I can help you explore HBI’s complete innovation, education, and community-impact ecosystem.",
    links: [
      ["Explore HBI’s pillars", "/#pillars"],
      ["View the portfolio", "/portfolio"],
    ],
  },
  {
    id: "student",
    label: "Student or family",
    detail: "Programs, skills, and careers",
    kicker: "For students and families",
    headline: ["Build the skills", "to shape what", "comes next."],
    intro:
      "Explore hands-on experiences where students use AI, data, connected technology, design, and entrepreneurship to solve real-world problems.",
    tags: ["Hands-on Projects", "AI & Data", "Mentorship", "Career Pathways"],
    primary: { label: "Explore STEAM Academy", href: "/steam-academy" },
    secondary: { label: "See Student Work", href: "/#stories" },
    stats: [
      { value: "320+", label: "Students Served" },
      { value: "80+", label: "Prototypes Built" },
      { value: "10 yrs", label: "Building Pathways" },
    ],
    message: "Great—I’ll guide you toward student programs, hands-on learning, and future career pathways.",
    links: [
      ["Explore STEAM Academy", "/steam-academy"],
      ["Watch student stories", "/#stories"],
    ],
  },
  {
    id: "educator",
    label: "School or educator",
    detail: "Cohorts and collaboration",
    kicker: "For schools and educators",
    headline: ["Bring real-world", "innovation into", "the classroom."],
    intro:
      "Partner with HBI to create project-based cohorts, industry-aligned learning, mentorship, and authentic challenges that turn technology into student momentum.",
    tags: ["Custom Cohorts", "Curriculum", "Industry Mentors", "Capstones"],
    primary: { label: "Bring HBI to Your School", href: "/contact" },
    secondary: { label: "View Academy Programs", href: "/steam-academy" },
    stats: [
      { value: "3", label: "Integrated Pillars" },
      { value: "80+", label: "Student Prototypes" },
      { value: "2016", label: "Programs Since" },
    ],
    message: "Welcome! I’ll highlight cohort opportunities, project-based learning, and ways schools can work with HBI.",
    links: [
      ["View STEAM programs", "/steam-academy"],
      ["Discuss a partnership", "/contact"],
    ],
  },
  {
    id: "partner",
    label: "Business or partner",
    detail: "MVPs, talent, and sponsorship",
    kicker: "For businesses and strategic partners",
    headline: ["Turn a challenge", "into a working", "MVP in 90 days."],
    intro:
      "Bring HBI a meaningful problem. Our Innovation Foundry aligns product strategy, AI, software, connected systems, and emerging talent around a testable solution.",
    tags: ["90-Day Sprints", "AI Agents", "Web Applications", "Product Strategy"],
    primary: { label: "Start a Foundry Sprint", href: "/contact" },
    secondary: { label: "Explore the Foundry", href: "/innovation-foundry" },
    stats: [
      { value: "90 days", label: "Concept to MVP" },
      { value: "10", label: "Core Capabilities" },
      { value: "1 team", label: "Strategy Through Build" },
    ],
    message: "I’ll focus your experience on innovation services, talent development, sponsorship, and strategic partnerships.",
    links: [
      ["Explore the Foundry", "/innovation-foundry"],
      ["Meet HBI partners", "/partners"],
    ],
  },
  {
    id: "supporter",
    label: "Donor or supporter",
    detail: "Access, scholarships, and impact",
    kicker: "For donors and community supporters",
    headline: ["Expand who gets", "to build the", "future."],
    intro:
      "Help remove barriers to high-quality STEAM learning through scholarships, mentorship, equipment, career exposure, and community-centered innovation programs.",
    tags: ["Scholarships", "Cohort Sponsorship", "Mentorship", "Community Access"],
    primary: { label: "Support the Mission", href: "/foundation" },
    secondary: { label: "Discuss a Partnership", href: "/contact" },
    stats: [
      { value: "320+", label: "Students Reached" },
      { value: "10 yrs", label: "Community Impact" },
      { value: "6", label: "Ways to Engage" },
    ],
    message: "Thank you. I’ll guide you toward the HBI Foundation, community impact, and ways to expand access and opportunity.",
    links: [
      ["Visit the Foundation", "/foundation"],
      ["Connect with HBI", "/contact"],
    ],
  },
  {
    id: "technology",
    label: "Technology explorer",
    detail: "AI, IoT, products, and portfolio",
    kicker: "For technology explorers",
    headline: ["See emerging", "technology put", "to work."],
    intro:
      "Explore applied AI, agents, data science, connected mobility, IoT, smart infrastructure, and human-centered products built around real needs.",
    tags: ["Applied AI", "AI Agents", "IoT", "Connected Mobility", "Product UX"],
    primary: { label: "View the Portfolio", href: "/portfolio" },
    secondary: { label: "Explore Technology", href: "/innovation-foundry" },
    stats: [
      { value: "80+", label: "Prototypes Built" },
      { value: "10", label: "Foundry Capabilities" },
      { value: "3", label: "Impact Engines" },
    ],
    message: "Let’s explore HBI’s work across AI, IoT, data science, connected systems, and product innovation.",
    links: [
      ["View the portfolio", "/portfolio"],
      ["Explore technology", "/innovation-foundry"],
    ],
  },
];

export function getAudiencePath(id: string | null) {
  return audiencePaths.find((path) => path.id === id);
}
