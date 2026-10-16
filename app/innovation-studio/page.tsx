import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter, SiteHeader } from "../components/SiteHeader";
import s from "./studio.module.css";

export const metadata: Metadata = {
  title: "Innovation Studio | HBI Ventures",
  description: "A planned learning workspace for schools, nonprofits and workforce-development partners. Students become product teams, guided by instructors and mentors. Targeting Spring 2027.",
  alternates: { canonical: "/innovation-studio" },
};

const journey = [
  ["Define the challenge", "Teams would investigate a real audience need, develop requirements, and write user stories with acceptance criteria."],
  ["Learn, then apply", "Introductory 101 modules would build a shared foundation. Maker labs would turn each lesson into applied team work."],
  ["Design the experience", "Teams would create annotated UI/UX mockups and systems designs, explaining how screens, data and components connect."],
  ["Build and present", "Functional web prototypes would develop through feedback and revision, leading to capstone demonstrations and presentations."],
];

export default function InnovationStudioPage() {
  return <main><SiteHeader /><div id="main-content" tabIndex={-1}>
    <section className={s.hero}>
      <div className={s.wrap}>
        <p className={s.status}>In development · Targeting Spring 2027</p>
        <h1>Innovation Studio</h1>
        <p className={s.lead}>Students become product teams.</p>
        <p className={s.intro}>A planned learning workspace that connects a design challenge, introductory lessons and maker labs—so learners can build something they can explain, improve and present.</p>
        <div className={s.actions}><a className={s.primary} href="mailto:info@hbiventures.com?subject=Innovation%20Studio%20Interest">Express Interest</a><a className={s.secondary} href="#learning-journey">Explore the planned experience</a></div>
        <p className={s.powered}>Powered by HBI Digital Experience Platform</p>
      </div>
    </section>
    <section className={`${s.wrap} ${s.preview}`} aria-labelledby="preview-title">
      <h2 id="preview-title">One challenge. A connected learning experience.</h2>
      <p>The Soccer IQ concept shows how a team might turn performance data into an athlete experience, with the same challenge visible on desktop and mobile.</p>
      <figure><Image src="/innovation-studio/soccer-desktop-mobile.png" alt="Preliminary Innovation Studio concept mockup showing a soccer-player design challenge on desktop and mobile, with module lessons, team labs, deliverables and instructor feedback. Powered by HBI Digital Experience Platform." width={1996} height={1248} sizes="(max-width: 800px) 100vw, 1200px" priority unoptimized /><figcaption>Preliminary concept mockup with illustrative data. Capabilities are in development. <a href="/innovation-studio/soccer-desktop-mobile.png">View the full-size mockup</a>.</figcaption></figure>
    </section>
    <section className={s.journey} id="learning-journey" aria-labelledby="journey-title"><div className={s.wrap}>
      <h2 id="journey-title">From a design challenge to a capstone.</h2>
      <p className={s.sectionIntro}>Planned capabilities would keep learning and making connected throughout the project.</p>
      <ol>{journey.map(([title,copy])=><li key={title}><h3>{title}</h3><p>{copy}</p></li>)}</ol>
    </div></section>
    <section className={`${s.wrap} ${s.partners}`} aria-labelledby="partners-title"><h2 id="partners-title">Built around learners. Shaped with partners.</h2><div className={s.partnerGrid}>
      <article><h3>Schools</h3><p>A planned way to connect classroom foundations with practical projects and a portfolio of student work.</p></article>
      <article><h3>Nonprofits</h3><p>A shared challenge could bring community programs, mentors and learners together around a meaningful local need.</p></article>
      <article><h3>Workforce-development partners</h3><p>Team roles, product artifacts and presentations would give learners opportunities to practice collaboration and explain their decisions.</p></article>
    </div><div className={s.human}><h3>Human guidance stays central.</h3><p>Instructors and mentors would guide the challenge, review evidence and support revision. AI Advisors are planned to help teams ask questions, develop drafts and reflect on their work, with people retaining teaching and review responsibilities.</p></div></section>
    <section className={s.closing}><div className={s.wrap}><h2>Help shape the next learning experience.</h2><p>Innovation Studio evolves the <a href="https://hbisteam.org/innovation-center">HBI STEAM Academy’s hands-on curriculum</a>. We welcome conversations with schools, nonprofits and workforce-development partners.</p><a className={s.primary} href="mailto:info@hbiventures.com?subject=Innovation%20Studio%20Interest">Express Interest</a><p className={s.note}>Opens an email to info@hbiventures.com. Spring 2027 is a target; scope and timing may change.</p></div></section>
  </div><SiteFooter /></main>;
}
