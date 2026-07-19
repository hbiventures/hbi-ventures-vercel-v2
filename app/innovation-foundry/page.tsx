import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "HBI Innovation Foundry | HBIVentures",
  description: "HBI’s applied product-development and commercialization engine for AI, IoT, cybersecurity, smart cities, and connected mobility.",
};

const capabilities = [
  ["AI", "Artificial Intelligence", "AI-first strategy, intelligent assistants, workflow automation, predictive insights, and generative applications."],
  ["IoT", "IoT & Smart Infrastructure", "Sensors, edge devices, connected environments, cloud integration, and real-time monitoring."],
  ["CY", "Cybersecurity", "Secure architectures, privacy, threat awareness, data governance, and resilient connected systems."],
  ["SC", "Smart Cities", "Mobility, public services, infrastructure intelligence, and data-enabled decision support."],
  ["CM", "Connected Mobility", "Connected-car concepts, transportation ecosystems, vehicle data, digital experiences, and safety innovation."],
  ["GO", "Commercialization", "Market discovery, prototyping, validation, partnerships, business models, and scale strategy."],
];

export default function FoundryPage() {
  return (
    <main>
      <SiteHeader />
      <div id="main-content">
        <section className="subpage-hero foundry-hero">
          <div>
            <p className="eyebrow"><span>●</span> Pillar 02 · Build, test, scale</p>
            <h1>HBI Innovation<br /><em>Foundry</em></h1>
          </div>
          <p>HBI’s applied product-development and commercialization engine—connecting global innovation capabilities with locally relevant challenges and opportunities.</p>
          <div className="hero-index">02</div>
        </section>

        <section className="subpage-intro">
          <div className="section-kicker"><span>01</span><p>The mission</p></div>
          <div className="subpage-intro-grid">
            <h2>Turning emerging technologies into <em>practical solutions.</em></h2>
            <div><p className="lead">The Foundry brings together technical experts, students, industry partners, researchers, and communities.</p><p>Together, they explore concepts, prototype solutions, validate value, and advance commercialization around challenges that matter.</p></div>
          </div>
        </section>

        <section className="capabilities-section">
          <div className="section-heading light-heading"><div><p className="eyebrow"><span>●</span> Core capabilities</p><h2>Technology with<br />a job to do.</h2></div><p>Every capability is applied through a human-centered lens, with clear users, measurable outcomes, and a path beyond the prototype.</p></div>
          <div className="capability-grid">
            {capabilities.map(([abbr, title, copy], index) => <article key={abbr}><span>{abbr}</span><b>0{index + 1}</b><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="engagement-section">
          <div className="section-kicker"><span>02</span><p>Engagement model</p></div>
          <h2>From challenge statement<br />to scalable impact.</h2>
          <div className="engagement-steps">
            <article><b>01</b><h3>Discover</h3><p>Define users, needs, constraints, and desired outcomes.</p></article>
            <article><b>02</b><h3>Design</h3><p>Develop concepts, experiences, architectures, and business assumptions.</p></article>
            <article><b>03</b><h3>Prototype</h3><p>Build testable products, workflows, demonstrations, and pilots.</p></article>
            <article><b>04</b><h3>Validate & scale</h3><p>Measure performance, refine the model, and prepare for deployment or commercialization.</p></article>
          </div>
        </section>

        <section className="page-cta"><p className="eyebrow"><span>●</span> Bring us a challenge</p><h2>Let’s turn possibility<br /><em>into proof.</em></h2><a href="/contact">Start a Foundry conversation <span>↗</span></a></section>
      </div>
      <SiteFooter />
    </main>
  );
}
