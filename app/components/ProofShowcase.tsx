import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ChatCircleDotsIcon, PathIcon, CalendarCheckIcon } from "@phosphor-icons/react/ssr";
import { platformFoundation, platformProjects } from "../lib/platform-projects";
import { EngagementLink } from "./EngagementLink";

const proof = {
  lia: "Video, custom forms, payments, site and campaign analytics, and analytics-informed strategy.",
  ejc: "Ask EJC visitor assistant, calendar-backed events, automated gathering updates, booking and giving pathways, analytics and reporting.",
  steam: "Immersive design, motion-led storytelling, responsive development, hosting, analytics and reporting.",
};

export function ProofShowcase() {
  return <section className="wt-platform" id="platform" aria-labelledby="platform-title">
    <div className="wt-container">
      <Image className="wt-dep-logo" src="/refresh/hbi-dep-logo.png" alt="Powered by HBI Digital Experience Platform" width={1350} height={220} sizes="(max-width: 700px) 88vw, 650px" />
      <h2 id="platform-title">One platform. Distinct experiences.</h2>
      <p className="wt-platform-intro">An AI-powered platform developed within the HBI Innovation Foundry.</p>
      <ul className="wt-foundation" aria-label="Delivered across every project">{platformFoundation.map(item => <li key={item}>{item}</li>)}</ul>
      <article className="wt-platform-capability" aria-labelledby="virtual-front-desk-capability-title">
        <div className="wt-platform-capability-copy">
          <p className="wt-kicker">Featured platform capability</p>
          <h3 id="virtual-front-desk-capability-title">Virtual Front Desk</h3>
          <p>Help customers get approved answers, understand the right service, and continue to the scheduling or inquiry path your business already uses.</p>
          <Link href="/innovation-foundry/virtual-front-desk">Explore Virtual Front Desk examples <ArrowRightIcon size={19} aria-hidden="true" /></Link>
        </div>
        <ul aria-label="Virtual Front Desk workflow">
          <li><ChatCircleDotsIcon size={25} weight="light" aria-hidden="true" /><span><strong>Answer</strong>Approved service, policy, and preparation questions</span></li>
          <li><PathIcon size={25} weight="light" aria-hidden="true" /><span><strong>Route</strong>Guide customers to the right service or person</span></li>
          <li><CalendarCheckIcon size={25} weight="light" aria-hidden="true" /><span><strong>Continue</strong>Use the business’s existing booking or inquiry process</span></li>
        </ul>
        <p className="wt-platform-capability-audience"><strong>Examples:</strong> plumbers, electricians, HVAC and field-service teams; salons and wellness businesses; professional services; venues; and fitness organizations.</p>
      </article>
      <div className="wt-project-grid" id="work">
        {platformProjects.map(project => <article className="wt-project" key={project.id}>
          <a className="wt-project-image" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name} (opens in new tab)`}>
            <Image src={project.image} alt={`${project.name} website`} width={project.width} height={project.height} sizes="(max-width: 700px) 90vw, 30vw" />
          </a>
          <a className="wt-project-title" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`${project.label}: ${project.name} (opens in new tab)`}>
            <h3>{project.label}</h3><p className="wt-project-name">{project.name}</p>
          </a>
          <p className="wt-project-proof">{proof[project.id]}</p>
          <div className="wt-project-actions">
            <a className="wt-project-link" href={project.url} target="_blank" rel="noopener noreferrer">{project.id === "steam" ? "Visit hbisteam.org" : `Explore ${project.label}`}</a>
            <EngagementLink entry={project.id} className="wt-project-inquiry">Discuss a similar project<span className="sr-only"> to {project.label}</span></EngagementLink>
          </div>
          <details className="wt-project-details"><summary>Project story &amp; delivered capabilities</summary>
            <h4>The focus</h4><p>{project.focus}</p>
            <h4>What HBI delivered</h4><ul>{project.capabilities.map(item => <li key={item}>{item}</li>)}</ul>
            <h4>The experience</h4><p>{project.experience}</p><p>{project.detail}</p>
          </details>
        </article>)}
      </div>
    </div>
  </section>;
}
