import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/SiteHeader";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy Notice | HBI Ventures",
  description: "How HBI Ventures handles information across its website, Customer Care Assistant, voice experience, contact forms and analytics.",
};

const sections = [
  ["information", "Information we collect"],
  ["assistant", "Customer Care Assistant"],
  ["voice", "Optional voice experience"],
  ["analytics", "Analytics and session replay"],
  ["sharing", "Service providers and sharing"],
  ["retention", "Retention and your choices"],
  ["contact", "Contact us"],
] as const;

export default function PrivacyPage() {
  return <>
    <SiteHeader />
    <main id="main-content" className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>HBI Ventures</p>
        <h1>Privacy, explained plainly.</h1>
        <p className={styles.intro}>This notice explains what information HBI Ventures, LLC (“HBI,” “we,” “us”) handles when you use this website, contact us, or interact with HBI’s Customer Care Assistant and optional voice experience.</p>
        <p className={styles.updated}>Effective and last updated: October 7, 2026</p>
      </section>

      <div className={styles.layout}>
        <nav className={styles.contents} aria-label="Privacy notice sections">
          <strong>On this page</strong>
          {sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>

        <article className={styles.notice}>
          <section>
            <h2>Scope</h2>
            <p>This notice applies to the HBI Ventures website and the HBI Digital Experience Platform features available on it. A linked third-party website or service may have its own privacy notice and practices.</p>
          </section>

          <section id="information">
            <h2>Information we collect</h2>
            <p>You may choose to give us your name, email address, phone number, organization, area of interest, project details, and other information in a contact form or inquiry. If you choose to share an assistant transcript, the reviewed transcript and any related campaign or page context are included with your inquiry.</p>
            <p>Please do not submit passwords, payment-card details, health information, or other sensitive information through the site, assistant, or voice experience.</p>
          </section>

          <section id="assistant">
            <h2>Customer Care Assistant</h2>
            <p>Questions and conversation context you submit are sent to the HBI Digital Experience Platform, which uses OpenAI APIs to process them and generate replies. Automated assistance can make mistakes, so do not rely on it as professional, legal, medical, or financial advice.</p>
            <p>Your conversation is not automatically emailed to HBI’s team. Sharing a transcript with HBI is optional and occurs only when you review an inquiry, choose to include the transcript, and submit the form.</p>
            <p>The assistant also offers optional interaction analytics for the current browser session. If you opt in, HBI records limited events such as the category selected or an HBI project link opened—not your questions, transcript, or contact details. You can turn this setting off in the assistant; that stops future optional assistant events but does not remove events already collected.</p>
          </section>

          <section id="voice">
            <h2>Optional voice experience</h2>
            <p>Marin is an AI-generated voice, not a live HBI team member. Voice is optional. Your microphone stays off until you check the consent box, select “Start voice conversation,” and allow microphone access in your browser. Each new voice session requires a new opt-in.</p>
            <p>While connected, microphone audio goes directly from your browser to OpenAI for processing. Muting pauses microphone input but keeps the session connected. Ending the session, closing the assistant, leaving the page, or hiding the page stops the site’s microphone tracks and closes its voice connection; it does not delete information already sent or processed.</p>
            <p>HBI does not save an audio recording in this experience. Completed captions can remain in the current page and can be added to the current text conversation when you return to text. Captions may contain errors. Review them before choosing whether to share a transcript with HBI.</p>
            <p>OpenAI’s API retention terms and the applicable HBI account settings govern information processed by OpenAI. Learn more in <a href="https://developers.openai.com/api/docs/guides/your-data" target="_blank" rel="noopener noreferrer">OpenAI’s API data controls<span className={styles.visuallyHidden}> (opens in a new tab)</span></a>.</p>
          </section>

          <section id="analytics">
            <h2>Analytics and session replay</h2>
            <p>When site analytics are enabled, HBI uses PostHog to understand page visits, navigation, page exits, errors, and general technical context. Session replay may capture how visitors use public pages, but HBI’s configuration blocks the Customer Care Assistant, contact form, and voice interface from replay. It also excludes request bodies, headers, and network capture for the site’s chat, contact, and voice API routes.</p>
            <p>PostHog may use cookies or similar browser storage according to HBI’s configuration and PostHog’s services. The site also uses session storage for choices such as optional assistant analytics and for temporary assistant or contact handoff details. Session storage generally lasts for the current browser tab session.</p>
            <p>Learn more about <a href="https://posthog.com/docs/privacy" target="_blank" rel="noopener noreferrer">PostHog’s privacy controls<span className={styles.visuallyHidden}> (opens in a new tab)</span></a>.</p>
          </section>

          <section id="sharing">
            <h2>Service providers and sharing</h2>
            <p>HBI uses service providers to operate this experience, including OpenAI for assistant and voice processing, PostHog for analytics when enabled, Resend to deliver contact-form inquiries, and Vercel for website hosting. These providers process information for their services under their own terms and HBI’s configurations.</p>
            <p>We may also disclose information when required by law, to protect rights or safety, or as part of a business transaction. We do not describe optional assistant analytics or private inquiries as public content.</p>
          </section>

          <section id="retention">
            <h2>Retention, security, and your choices</h2>
            <p>HBI keeps submitted inquiries and related business records only as long as reasonably needed to respond, maintain business records, resolve disputes, protect the service, and meet legal obligations. Provider retention periods may differ. OpenAI explains that API abuse-monitoring logs may retain certain inputs and outputs for up to 30 days by default, subject to product, feature, account, legal, and safety exceptions described in its API data controls.</p>
            <p>HBI uses reasonable administrative and technical safeguards, but no online service can promise absolute security. Depending on applicable law, you may ask to access, correct, or delete personal information HBI controls. Some records may be retained where required or permitted by law or where a provider’s systems and applicable settings govern retention.</p>
            <p>This website is not designed to collect personal information from children through the assistant or contact form. A parent or guardian who believes a child submitted personal information can contact HBI so we can review the request.</p>
          </section>

          <section id="contact">
            <h2>Contact us</h2>
            <p>Questions or privacy requests can be sent to <a href="mailto:info@hbiventures.com">info@hbiventures.com</a>. Please describe the request and the part of the site or experience involved so we can respond appropriately.</p>
            <p>We may update this notice as the site, providers, or legal requirements change. The effective date above identifies the latest version.</p>
            <Link className={styles.contactLink} href="/contact">Contact HBI</Link>
          </section>
        </article>
      </div>
    </main>
    <SiteFooter />
  </>;
}
