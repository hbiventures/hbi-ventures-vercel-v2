import type { Metadata } from "next";
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
      <section className="wt-closing"><div className="wt-container"><div><p className="wt-kicker">Let’s build a more connected experience</p><h2>What could work better<br />in your organization?</h2></div><div className="wt-closing-actions"><div className="wt-actions"><EngagementLink className="eco-button" entry="closing">Discuss your project</EngagementLink><a className="eco-button wt-button-outline" href="#assessment">Explore your automation opportunities</a></div><p>Tell us your priority. We’ll review the fit and discuss scope before any commitment.</p></div></div></section>
      <AssessmentDisclosure><InnovationNavigator /></AssessmentDisclosure>
    </div>
    <SiteFooter />
  </main>;
}
