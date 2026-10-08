import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteHeader";
import { ContactForm } from "./ContactForm";
import { parseEngagementEntry, parseEngagementOffer } from "../lib/engagement";
import { parseVirtualFrontDeskCampaign, parseVirtualFrontDeskCity, parseVirtualFrontDeskContent, parseVirtualFrontDeskIndustry, type VirtualFrontDeskAttribution } from "../lib/virtual-front-desk";

export const metadata: Metadata = {
  title: "Connect With HBIVentures",
  description: "Bring your organization’s vision to life through a digital experience, virtual assistant, integrations or analytics with HBI Innovation Foundry. Partnership, Academy and community inquiries are welcome too.",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const offer = parseEngagementOffer(query.offer);
  const entry = parseEngagementEntry(query.from);
  const industry = parseVirtualFrontDeskIndustry(query.vfd_industry);
  const attribution: VirtualFrontDeskAttribution | undefined = entry === "virtual-front-desk" ? {
    industry,
    city: parseVirtualFrontDeskCity(query.vfd_city),
    campaign: parseVirtualFrontDeskCampaign(query.vfd_campaign),
    content: parseVirtualFrontDeskContent(query.vfd_content, industry),
  } : undefined;
  return (
    <main>
      <SiteHeader />
      <div id="main-content">
        <section className="contact-hero"><p className="eyebrow">Connect with HBI</p><h1>Start with what<br /><em>could work better.</em></h1><p>A digital experience that brings your vision to life. A helpful assistant. Tools that work together. Tell the HBI Innovation Foundry what you want people to see, understand and do, and let’s discuss the right next step.</p></section>
        <section className="contact-layout">
          <div className="contact-aside"><p className="eyebrow dark-eyebrow">From inquiry to a clear scope</p><h2>What happens next?</h2>
            <ol className="contact-next-steps">
              <li><strong>Share your priority</strong><p>Your audience, the problem and the tools you use are a useful starting point.</p></li>
              <li><strong>Discuss the fit</strong><p>We review your inquiry and follow up using the contact details you provide.</p></li>
              <li><strong>Agree before we build</strong><p>If there’s a fit, we define deliverables, responsibilities, timing and support around your goals.</p></li>
            </ol>
            <p>An inquiry is not a purchase or a commitment to a project.</p>
            <a href="mailto:info@hbiventures.com">info@hbiventures.com</a>
            <details className="contact-other"><summary>Here for another part of HBI?</summary><p>Partnerships, sponsorships, research, volunteering and community inquiries are welcome. Choose the relevant area in the form.</p><p>For Academy programs and student projects, visit <a href="https://hbisteam.org">HBI STEAM Academy</a>.</p></details>
          </div>
          <ContactForm key={`${offer}:${entry}:${attribution?.industry ?? "none"}`} initialOffer={offer} entry={entry} initialAttribution={attribution} />
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
