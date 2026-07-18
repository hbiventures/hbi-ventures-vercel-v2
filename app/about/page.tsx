import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "About HBI Ventures", description: "HBI Ventures connects innovation, education, and community impact through three integrated pillars." };

const priorities = [
  ["01", "Develop talent", "Prepare learners for college, careers, entrepreneurship, and leadership in an innovation-driven economy."],
  ["02", "Advance technology", "Build, test, and validate emerging-technology concepts through applied research and product development."],
  ["03", "Expand opportunity", "Ensure underrepresented communities can access high-quality learning, mentorship, innovation, and workforce pathways."],
];

export default function AboutPage() {
  return <main><SiteHeader /><div id="main-content">
    <section className="subpage-hero about-hero"><div><p className="eyebrow"><span>●</span> About HBI Ventures</p><h1>Three pillars.<br /><em>One system.</em></h1></div><p>An innovation and impact organization building, testing, and scaling emerging technologies while developing the next generation of diverse technical talent.</p><div className="hero-index">HBI</div></section>
    <section className="subpage-intro"><div className="section-kicker"><span>01</span><p>Our model</p></div><div className="subpage-intro-grid"><h2>Innovation, education, and community impact <em>working together.</em></h2><div><p className="lead">HBI is built on three integrated pillars: HBI STEAM Academy, HBI Innovation Foundry, and HBI Foundation.</p><p>Together, they create a continuous pipeline from education to innovation to workforce and community impact—delivering globally informed, locally relevant, and measurable outcomes.</p></div></div></section>
    <section className="model-section"><article><span>01</span><h3>STEAM Academy</h3><p>Develop future-ready technical and creative talent.</p><a href="/steam-academy">Explore Academy ↗</a></article><article><span>02</span><h3>Innovation Foundry</h3><p>Apply emerging technologies to authentic challenges.</p><a href="/innovation-foundry">Explore Foundry ↗</a></article><article><span>03</span><h3>Foundation</h3><p>Expand access and sustain community pathways.</p><a href="/foundation">Explore Foundation ↗</a></article></section>
    <section className="strategic-section"><div><p className="eyebrow dark-eyebrow"><span>●</span> Strategic priorities</p><h2>What HBI is built<br />to accomplish.</h2></div><div>{priorities.map(([n,t,c])=><article key={n}><b>{n}</b><h3>{t}</h3><p>{c}</p></article>)}</div></section>
    <section className="page-cta"><p className="eyebrow"><span>●</span> One connected ecosystem</p><h2>Build something<br /><em>that compounds.</em></h2><a href="/contact">Connect with HBI <span>↗</span></a></section>
  </div><SiteFooter /></main>;
}
