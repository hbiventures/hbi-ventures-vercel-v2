import type { Metadata } from "next";
import { MagnifyingGlassIcon, GearSixIcon, RocketLaunchIcon, ChartBarIcon } from "@phosphor-icons/react/ssr";
import { SiteFooter, SiteHeader } from "./components/SiteHeader";
import { ExperienceHero } from "./components/ExperienceHero";
import { ExperienceIntro } from "./components/ExperienceIntro";
import { PillarsOverview } from "./components/PillarsOverview";
import { ProofShowcase } from "./components/ProofShowcase";
import { WorkflowTheatre } from "./components/WorkflowTheatre";
import { InnovationNavigator } from "./components/InnovationNavigator";
import { AssessmentDisclosure } from "./components/AssessmentDisclosure";
import { ExperienceOffer } from "./components/ExperienceOffer";
import { EngagementLink } from "./components/EngagementLink";

export const metadata: Metadata = {
  title: "Technology Consulting & Managed Websites | HBI Ventures",
  description: "Technology consulting, managed websites, Virtual Help Desk, integrations and product development for small and midsize organizations across the United States.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Technology Consulting & Managed Websites | HBI Ventures",
    description: "Connect your digital experience, customer care and business workflows with HBI Innovation Foundry. Serving organizations nationwide.",
    url: "/",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "HBI Ventures digital experience ecosystem" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technology Consulting & Managed Websites | HBI Ventures",
    description: "Digital experiences, Virtual Help Desk, integrations and product development for organizations nationwide.",
    images: ["/og.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.hbiventures.com/#organization",
  name: "HBI Ventures",
  url: "https://www.hbiventures.com/",
  logo: "https://www.hbiventures.com/refresh/hbi-logo.png",
  email: "info@hbiventures.com",
  description: "HBI Ventures connects applied technology, talent development and community opportunity through three complementary pillars.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.hbiventures.com/#website",
  name: "HBI Ventures",
  url: "https://www.hbiventures.com/",
  inLanguage: "en-US",
  publisher: { "@id": "https://www.hbiventures.com/#organization" },
};

const processSteps = [
  { icon: MagnifyingGlassIcon, title: "Discover", copy: "Understand your goals and audience." },
  { icon: GearSixIcon, title: "Design & build", copy: "Develop and integrate your solution." },
  { icon: RocketLaunchIcon, title: "Launch", copy: "Test, train and move into production." },
  { icon: ChartBarIcon, title: "Measure & improve", copy: "Refine based on insight and evolving needs." },
];

export default function Home() {
  return <main className="wt-home">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
    <SiteHeader />
    <div id="main-content" tabIndex={-1}>
      <ExperienceIntro><ExperienceHero /></ExperienceIntro>
      <PillarsOverview />
      <section className="wt-process wt-container" aria-labelledby="studio-feature-title">
        <div className="wt-process-heading"><div><p className="wt-kicker">In development · Targeting Spring 2027</p><h2 id="studio-feature-title">Innovation Studio</h2></div><p>A planned learning workspace powered by HBI Digital Experience Platform. Students become product teams, connecting introductory lessons and maker labs with instructor and mentor guidance.</p></div>
        <a className="eco-button" href="/innovation-studio">Explore Innovation Studio</a>
      </section>
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
