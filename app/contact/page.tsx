import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteHeader";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Connect With HBIVentures",
  description: "Contact HBIVentures about partnerships, programs, technology pilots, sponsorships, research, volunteering, and community initiatives.",
};

export default function ContactPage() {
  return (
    <main>
      <SiteHeader />
      <div id="main-content">
        <section className="contact-hero"><p className="eyebrow"><span>●</span> Connect with HBI</p><h1>Let’s build the next<br /><em>opportunity together.</em></h1><p>Partnerships, school programs, technology pilots, sponsorships, research collaboration, volunteering, and community initiatives all start with a conversation.</p></section>
        <section className="contact-layout">
          <div className="contact-aside"><p className="eyebrow dark-eyebrow"><span>●</span> Start a conversation</p><h2>What can we build together?</h2><p>Choose the area that fits best. We’ll use the details to route your inquiry and begin with the right context.</p><a href="mailto:info@hbiventures.com">info@hbiventures.com <span>↗</span></a><div className="contact-topics"><span>School programs</span><span>Technology pilots</span><span>Sponsorships</span><span>Research</span><span>Mentorship</span><span>Community initiatives</span></div></div>
          <ContactForm />
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
