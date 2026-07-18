import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "HBI STEAM Academy | HBI Ventures", description: "Hands-on, project-based learning aligned to authentic industry, workforce, and community challenges." };

const pathways = [
  ["AI", "AI & Data", "Generative AI, analytics, machine learning concepts, visualization, and responsible data use."],
  ["CS", "Connected Systems", "IoT, sensors, cloud, smart cities, connected vehicles, and digital infrastructure."],
  ["CY", "Cybersecurity", "Privacy, secure design, digital resilience, and responsible technology practices."],
  ["SH", "Sports & Health Technology", "Wearables, human performance, analytics, biomechanics, and digital wellness."],
  ["AM", "ARTS & Media", "Film, storytelling, digital production, design, and creative technology."],
  ["EN", "Entrepreneurship", "Product strategy, market research, business models, pitching, and commercialization."],
];

export default function AcademyPage(){return <main><SiteHeader/><div id="main-content">
  <section className="subpage-hero academy-hero"><div><p className="eyebrow"><span>●</span> Pillar 01 · Learn by building</p><h1>HBI STEAM<br /><em>Academy</em></h1></div><p>Developing future-ready talent through hands-on, project-based learning aligned to authentic industry, workforce, and community challenges.</p><div className="hero-index">01</div></section>
  <section className="academy-feature"><div><p className="eyebrow dark-eyebrow"><span>●</span> Future-ready innovators</p><h2>Students do more than learn technology. <em>They use it to solve problems.</em></h2><p>Middle school, high school, and early college learners design, build, test, and present solutions across technical and creative fields.</p><ul><li>Hands-on innovation challenges</li><li>Industry-aligned experiences</li><li>Mentorship and career pathways</li><li>Team-based product development</li><li>Capstones and pitch competitions</li></ul></div><img src="/steam-program-features.png" alt="HBI STEAM Academy key program features"/></section>
  <section className="cohort-section"><div className="section-heading light-heading"><div><p className="eyebrow"><span>●</span> Technology innovation cohorts</p><h2>Real students.<br />Real solutions.</h2></div><p>Learners identify a challenge, research users and systems, apply design thinking, prototype, test, present, and refine.</p></div><div className="cohort-grid"><img src="/acrb-ai-project.png" alt="Student presenting an AI concept for the Atlanta Citizen Review Board"/><div><span>AI · UX · CIVIC INNOVATION</span><h3>AI for civic engagement</h3><p>A student team explored an AI-enabled concept to improve citizen access, reporting, communication, and case-management experiences.</p></div></div></section>
  <section className="arts-section"><img src="/nextgen-arts-cohort.png" alt="HBI NextGen Arts Cohort program collage"/><div><p className="eyebrow dark-eyebrow"><span>●</span> ARTS, digital media & storytelling</p><h2>Where creativity meets technology.</h2><p>Launched in 2021, the NextGen Arts Cohort connected students with entertainment and creative-industry professionals while they developed film, screenwriting, editing, audio, collaboration, and presentation skills.</p><p>Students produced three original short films with support from an extensive creative-industry network.</p></div></section>
  <section className="pathways-section"><div><p className="eyebrow dark-eyebrow"><span>●</span> Innovation pathways</p><h2>Fields shaping<br />the future.</h2></div><div className="pathway-grid">{pathways.map(([a,t,c])=><article key={a}><span>{a}</span><h3>{t}</h3><p>{c}</p></article>)}</div></section>
  <section className="page-cta"><p className="eyebrow"><span>●</span> Bring HBI to your students</p><h2>Turn learning<br /><em>into momentum.</em></h2><a href="/contact">Explore an Academy partnership <span>↗</span></a></section>
  </div><SiteFooter/></main>}
