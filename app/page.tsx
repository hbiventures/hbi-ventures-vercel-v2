import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlassIcon, GearSixIcon, RocketLaunchIcon, ChartBarIcon } from "@phosphor-icons/react/ssr";
import { SiteFooter, SiteHeader } from "./components/SiteHeader";
import { ExperienceHero } from "./components/ExperienceHero";
import { PillarsOverview } from "./components/PillarsOverview";
import { ProofShowcase } from "./components/ProofShowcase";
import { WorkflowTheatre } from "./components/WorkflowTheatre";
import { InnovationNavigator } from "./components/InnovationNavigator";
import { AssessmentDisclosure } from "./components/AssessmentDisclosure";
import { ExperienceOffer } from "./components/ExperienceOffer";
import { EngagementLink } from "./components/EngagementLink";

export const metadata: Metadata = {
  title: "HBI Ventures — Your digital experience should do more",
  description: "Your digital experience should be a living vision board into your organization. Bring your purpose, people and work to life with HBI Innovation Foundry’s design, AI, automation, integrations and analytics.",
};

const featuredPartners = [
  { name: "Metric Mate", image: "/metric-mate-logo.jpg", url: "https://www.themetricmate.com/", field: "Performance technology" },
  { name: "Soccer IQ Institute", image: "/soccer-iq-logo.png", url: "https://www.socceriqinstitute.com/", field: "Sports & development" },
  { name: "FAM Incorporated", image: "/fam-logo.png", url: "https://www.famincorporated.org/", field: "Arts & creative media" },
  { name: "The ORTHO Project", image: "/ortho-project.png", url: "https://www.orthoproject.org/", field: "Healthcare & sports medicine" },
  { name: "The LEWIS Registry", image: "/lewis-registry-logo.png", url: "https://www.thelewisregistry.org/", field: "Civic & community innovation" },
];
const partnerGroups = [
  { title: "School systems & education", names: ["Morehouse College TRIO Program", "Gwinnett County Public Schools", "Fayette County Public Schools", "Georgia Institute of Technology", "Clark Atlanta University", "Atlanta Public Schools"] },
  { title: "Industry & innovation", names: ["Microsoft", "OpenAI", "Metric Mate", "FAM Incorporated", "Soccer IQ Institute", "The ORTHO Project", "The LEWIS Registry"] },
  { title: "Community & creative industries", names: ["Urban League of Greater Atlanta", "Georgia Film Academy", "Tyler Perry Studios", "Dallas Austin Foundation", "Boston University Theatre Program", "Georgia Governor’s Office of Film"] },
];


const processSteps = [
  { icon: MagnifyingGlassIcon, title: "Discover", copy: "Understand your goals and audience." },
  { icon: GearSixIcon, title: "Design & build", copy: "Develop and integrate your solution." },
  { icon: RocketLaunchIcon, title: "Launch", copy: "Test, train and move into production." },
  { icon: ChartBarIcon, title: "Measure & improve", copy: "Refine based on insight and evolving needs." },
];

export default function Home() {
  return <main className="wt-home">
    <SiteHeader />
    <div id="main-content" tabIndex={-1}>
      <ExperienceHero />
      <PillarsOverview />
      <ProofShowcase />
      <ExperienceOffer />
      <WorkflowTheatre />
      <section className="wt-process wt-container" aria-labelledby="process-title">
        <div className="wt-process-heading"><h2 id="process-title">Start with the challenge.</h2><p>Delivery scope and ongoing support are agreed for each engagement.</p></div>
        <div className="wt-process-grid">{processSteps.map(item => <article key={item.title}><item.icon size={42} weight="light" aria-hidden="true" /><div><h3>{item.title}</h3><p>{item.copy}</p></div></article>)}</div>
      </section>
      <section className="wt-partners" id="partners" aria-labelledby="partners-title"><div className="wt-container">
        <div className="wt-partner-heading"><h2 className="wt-kicker" id="partners-title">Our partners</h2><Link href="/partners">Explore the complete partner network</Link></div>
        <div className="wt-partner-row">{featuredPartners.map(partner => <a key={partner.name} href={partner.url} target="_blank" rel="noopener noreferrer"><Image src={partner.image} alt="" width={104} height={56} sizes="104px" /><strong>{partner.name}</strong></a>)}</div>
        <details className="wt-directory"><summary>All 19 partners</summary><div className="eco-partner-directory">{partnerGroups.map(group => <div key={group.title}><h3>{group.title}</h3><ul>{group.names.map(name => <li key={name}>{name}</li>)}</ul></div>)}</div></details>
      </div></section>
      <section className="wt-closing"><div className="wt-container"><div><p className="wt-kicker">Let’s build a more connected experience</p><h2>What could work better<br />in your organization?</h2></div><div className="wt-closing-actions"><div className="wt-actions"><EngagementLink className="eco-button" entry="closing">Discuss your project</EngagementLink><a className="eco-button wt-button-outline" href="#assessment">Explore your automation opportunities</a></div><p>Tell us your priority. We’ll review the fit and discuss scope before any commitment.</p></div></div></section>
      <AssessmentDisclosure><InnovationNavigator /></AssessmentDisclosure>
    </div>
    <SiteFooter />
  </main>;
}
