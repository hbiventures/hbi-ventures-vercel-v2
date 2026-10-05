import Image from "next/image";
import Link from "next/link";
import { GraduationCapIcon, UsersThreeIcon } from "@phosphor-icons/react/ssr";
import { platformProjects } from "../lib/platform-projects";
import { EngagementLink } from "./EngagementLink";
import { CinematicMotionControl } from "./CinematicMotionControl";

export function ExperienceHero() {
  return <section className="wt-hero" aria-labelledby="experience-title">
    <div className="wt-container">
      <div className="wt-hero-main">
        <div className="wt-hero-copy">
          <p className="wt-kicker">HBI Innovation Foundry</p>
          <h1 id="experience-title">Your digital<br />experience<br /><span>should do more.</span></h1>
          <p className="wt-hero-intro">Your digital experience should be a living vision board into your organization—showing who you are, what you stand for, and where you’re going.</p>
          <div className="wt-actions"><EngagementLink className="eco-button" entry="hero">Discuss your project</EngagementLink><a className="eco-button wt-button-outline" href="#work">See our work</a></div>
          <a className="wt-hero-offer" href="#engagement">Explore our capabilities</a>
          <CinematicMotionControl />
        </div>
        <div className="wt-project-stage" aria-label="Built on the HBI Digital Experience Platform">
          {platformProjects.map(project => <div className={`wt-hero-plane wt-hero-plane-${project.id}`} key={project.id}><a className={`wt-hero-screen wt-hero-screen-${project.id}`} href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Explore ${project.name} (opens in new tab)`}>
            <Image src={project.image} alt={`${project.label} digital experience`} width={project.width} height={project.height} sizes="(max-width: 700px) 56vw, 34vw" priority />
          </a></div>)}
        </div>
      </div>
      <nav className="wt-pillar-strip" aria-label="HBI Ventures three pillars">
        <Link href="/innovation-foundry"><Image src="/refresh/hbi-emblem-engraved.png" alt="" width={40} height={48} /><span><strong>HBI Innovation Foundry</strong><small>Technology development</small></span></Link>
        <a href="https://hbisteam.org"><GraduationCapIcon size={46} weight="light" aria-hidden="true" /><span><strong>HBI STEAM Academy</strong><small>Talent development</small></span></a>
        <Link href="/foundation"><UsersThreeIcon size={46} weight="light" aria-hidden="true" /><span><strong>HBI Foundation</strong><small>Community opportunity</small></span></Link>
      </nav>
    </div>
  </section>;
}
