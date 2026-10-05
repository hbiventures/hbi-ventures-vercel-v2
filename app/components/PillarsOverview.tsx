import Link from "next/link";

const pillars = [
  {
    name: "HBI Innovation Foundry",
    role: "Build practical solutions.",
    description: "Develops AI-powered products, automation and digital experiences that help organizations address real needs.",
    contribution: "Advances HBI’s technology mission by turning ideas into tools people can use. Home of the HBI Digital Experience Platform.",
    href: "/innovation-foundry",
    action: "Explore the Foundry",
  },
  {
    name: "HBI STEAM Academy",
    role: "Develop future-ready talent.",
    description: "Builds technical and creative skills that prepare learners for education, careers and entrepreneurship.",
    contribution: "Advances HBI’s talent mission by helping people prepare to create, lead and participate in an innovation-driven economy.",
    href: "https://hbisteam.org",
    action: "Explore HBI STEAM",
  },
  {
    name: "HBI Foundation",
    role: "Expand access to opportunity.",
    description: "Supports scholarships, mentorship and community partnerships that help more people participate in learning and innovation.",
    contribution: "Advances HBI’s access mission by addressing barriers and supporting pathways for underrepresented communities.",
    href: "/foundation",
    action: "Explore the Foundation",
  },
] as const;

export function PillarsOverview() {
  return <section className="wt-pillars" id="pillars" aria-labelledby="pillars-title">
    <div className="wt-container">
      <div className="wt-pillars-heading">
        <div><p className="wt-kicker">The purpose behind HBI Ventures</p><h2 id="pillars-title">Three pillars.<br />One purpose.</h2></div>
        <p>HBI connects technology, talent and access to turn ideas into practical solutions and broaden participation in the innovation economy.</p>
      </div>
      <div className="wt-pillars-grid">
        {pillars.map(pillar => <article key={pillar.name}>
          <p className="wt-pillar-name">{pillar.name}</p>
          <h3>{pillar.role}</h3>
          <p>{pillar.description}</p>
          <p className="wt-pillar-contribution">{pillar.contribution}</p>
          <Link href={pillar.href}>{pillar.action}</Link>
        </article>)}
      </div>
      <div className="wt-pillars-together">
        <h3>How they work together</h3>
        <p>The Foundry focuses on what technology can do. The Academy develops the people who can shape it. The Foundation works to widen access to both. Together, they support one HBI goal: <strong>practical innovation, future-ready talent and broader opportunity.</strong></p>
        <Link href="/about">Understand the HBI vision</Link>
      </div>
    </div>
  </section>;
}
