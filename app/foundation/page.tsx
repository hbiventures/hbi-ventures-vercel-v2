import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "HBI Foundation | HBI Ventures",
  description: "Expanding equitable access, mentorship, community engagement, and workforce opportunity in the innovation economy.",
};

const priorities = [
  ["01", "Scholarships & access", "Reduce financial barriers to high-quality STEAM programs, technology experiences, and career exploration."],
  ["02", "Mentorship", "Connect learners with professionals, researchers, entrepreneurs, educators, and community leaders."],
  ["03", "Community engagement", "Co-design relevant programs and solutions with schools, families, nonprofits, and neighborhood partners."],
  ["04", "Volunteer network", "Mobilize technical experts, corporate teams, alumni, and community supporters."],
  ["05", "Workforce equity", "Create pathways into high-demand technical fields for communities underrepresented in innovation."],
  ["06", "Long-term sustainability", "Build the funding, partnerships, infrastructure, and measurement systems required for lasting impact."],
];

export default function FoundationPage() {
  return (
    <main>
      <SiteHeader />
      <div id="main-content">
        <section className="subpage-hero foundation-hero">
          <div><p className="eyebrow"><span>●</span> Pillar 03 · Access & sustainability</p><h1>HBI<br /><em>Foundation</em></h1></div>
          <p>Ensuring equitable access, community engagement, and the long-term support required to expand participation in innovation.</p>
          <div className="hero-index">03</div>
        </section>

        <section className="subpage-intro">
          <div className="section-kicker"><span>01</span><p>The mission</p></div>
          <div className="subpage-intro-grid">
            <h2>Removing barriers. Building <em>durable pathways.</em></h2>
            <div><p className="lead">Talent is everywhere. Access is not.</p><p>The Foundation supports the scholarships, mentorship, community programming, resource development, and partnerships that help learners participate fully in the innovation economy.</p></div>
          </div>
        </section>

        <section className="priority-section">
          <div className="section-heading light-heading"><div><p className="eyebrow"><span>●</span> What we enable</p><h2>Access designed<br />to last.</h2></div><p>Community impact grows when opportunity is supported with the right people, resources, and long-term infrastructure.</p></div>
          <div className="priority-grid">{priorities.map(([number, title, copy]) => <article key={number}><b>{number}</b><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </section>

        <section className="partnership-section">
          <div><p className="eyebrow dark-eyebrow"><span>●</span> Ways to engage</p><h2>Invest in the next generation of innovators.</h2><p>Corporate sponsors, philanthropic partners, volunteers, and community organizations can expand both access and outcomes.</p></div>
          <ul><li>Sponsor a student cohort</li><li>Fund scholarships and stipends</li><li>Provide mentors or subject-matter experts</li><li>Host site visits and career experiences</li><li>Support equipment and technology access</li><li>Co-create community innovation initiatives</li></ul>
        </section>

        <section className="page-cta foundation-cta"><p className="eyebrow"><span>●</span> Partner with the Foundation</p><h2>Help opportunity<br /><em>reach further.</em></h2><a href="/contact">Discuss a partnership <span>↗</span></a></section>
      </div>
      <SiteFooter />
    </main>
  );
}
