import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "About HBIVentures", description: "HBIVentures connects innovation, education, and community impact through three integrated pillars." };

const priorities = [
  ["Develop talent", "Prepare learners for college, careers, entrepreneurship, and leadership in an innovation-driven economy."],
  ["Advance technology", "Build, test, and validate emerging-technology concepts through applied research and product development."],
  ["Expand opportunity", "Ensure underrepresented communities can access high-quality learning, mentorship, innovation, and workforce pathways."],
];

export default function AboutPage() {
  return <main><SiteHeader /><div id="main-content">
    <section className="subpage-hero about-hero"><div><p className="eyebrow"><span>●</span> About HBIVentures</p><h1>Three pillars.<br /><em>One system.</em></h1></div><p>An innovation and impact organization building, testing, and scaling emerging technologies while developing the next generation of diverse technical talent.</p><div className="hero-index">HBI</div></section>
    <section className="subpage-intro"><div className="section-kicker"><p>Our model</p></div><div className="subpage-intro-grid"><h2>Innovation, education, and community impact <em>working together.</em></h2><div><p className="lead">HBI Ventures connects technology, talent and access through three complementary pillars: HBI Innovation Foundry, HBI STEAM Academy and HBI Foundation.</p><p>The Foundry focuses on what technology can do. The Academy develops the people who can shape it. The Foundation works to widen access to both. Together, they support HBI’s goal of practical innovation, future-ready talent and broader opportunity.</p></div></div></section>
    <section className="model-section"><article><h3>STEAM Academy</h3><p>Develop technical and creative talent, preparing learners for education, careers and entrepreneurship.</p><a href="https://hbisteam.org">Explore Academy</a></article><article><h3>Innovation Foundry</h3><p>Turn ideas into practical solutions through AI, automation, product development and the HBI Digital Experience Platform.</p><a href="/innovation-foundry">Explore Foundry</a></article><article><h3>Foundation</h3><p>Address barriers through scholarships, mentorship and community partnerships that expand participation in learning and innovation.</p><a href="/foundation">Explore Foundation</a></article></section>
    <section className="strategic-section"><div><p className="eyebrow dark-eyebrow"><span>●</span> Strategic priorities</p><h2>What HBI is built<br />to accomplish.</h2></div><div>{priorities.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="page-cta"><p className="eyebrow"><span>●</span> One connected ecosystem</p><h2>Build something<br /><em>that compounds.</em></h2><a href="/contact">Connect with HBI</a></section>
  </div><SiteFooter /></main>;
}
