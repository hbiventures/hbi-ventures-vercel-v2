import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { UsersThreeIcon, MagnifyingGlassIcon, CheckCircleIcon, ChatCircleDotsIcon, HandshakeIcon, ChartBarIcon } from "@phosphor-icons/react/ssr";
import { SiteFooter, SiteHeader } from "../../components/SiteHeader";
import { clientConnectProcess } from "../../lib/client-connect-process";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Client Connect | Managed Outreach & Introductions",
  description: "Pursue new business relationships with Client Connect: Essential, Growth and Concierge managed outreach, client-approved messaging and agreed follow-up.",
  alternates: { canonical: "/innovation-foundry/client-connect" },
};

const inquiry = "/contact?offer=client-connect&from=client-connect";
const processIcons = {
  audience: UsersThreeIcon, research: MagnifyingGlassIcon, approval: CheckCircleIcon,
  outreach: ChatCircleDotsIcon, introduction: HandshakeIcon, reporting: ChartBarIcon,
};

export default function ClientConnectPage() {
  return <main className={styles.page}>
    <SiteHeader />
    <div id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="client-connect-title"><div className={styles.inner}>
        <p className={styles.eyebrow}>Client Connect | Managed Outreach &amp; Introductions</p>
        <h1 id="client-connect-title">Pursue your next business relationship without managing every outreach step yourself</h1>
        <p className={styles.lead}>Client Connect is a managed solution for businesses that want to reach potential clients and referral partners while keeping their attention on the work they already do well.</p>
        <p className={styles.responsibility}>If finding new business keeps competing with serving your current clients, HBI can take on the agreed outreach coordination. You stay in control of whom you approach, what you say and which conversations you pursue.</p>
        <div className={styles.actions}><Link className={styles.primary} href={inquiry}>Discuss whether Client Connect is a fit.</Link><a className={styles.secondary} href="#support-levels">Explore the three levels</a></div>
        <p className={styles.provenance}>Developed in the HBI Innovation Foundry. Part of the HBI Digital Experience Platform.</p>
      </div></section>
      <section className={styles.outcomes} aria-labelledby="outcomes-title"><div className={styles.inner}>
        <p className={styles.eyebrow}>What changes for you</p>
        <h2 id="outcomes-title">More room for the work that matters.</h2>
        <div className={styles.outcomeGrid}>
            <article><h3>More of the outreach work has an owner.</h3><p>When outreach depends on your spare time, research and follow-up can keep getting pushed back. With an agreed Client Connect plan, HBI handles that work on the agreed schedule. The intended benefit is less coordination on your plate, with approvals and sales still in your hands.</p></article>
            <article><h3>You can see where things stand.</h3><p>Instead of having to reconstruct progress across scattered messages, you can review the agreed activity, responses and next steps. You know what needs your attention and what has not yet produced interest.</p></article>
            <article><h3>You have context for the conversations you choose.</h3><p>Research helps explain why an organization may be relevant. When both parties want to connect, the handoff brings the context with it so your team can assess fit and lead the conversation.</p></article>
            <article><h3>You have a clearer basis for the next growth decision.</h3><p>Compare the response and business outcomes your team verifies with the money and effort invested. Use that evidence to continue, change the approach or stop.</p></article>
        </div>
      </div></section>
      <section id="support-levels" className={styles.levels} aria-labelledby="levels-title"><div className={styles.inner}>
        <p className={styles.eyebrow}>Three levels of support</p>
        <h2 id="levels-title">Choose the level of support<br className={styles.desktopBreak} /> that fits your business.</h2>
        <div className={styles.tierGrid}>
            <article className={styles.tier}><p className={styles.tierLabel}>Client Connect</p><h3>Essential</h3><p className={styles.fit}>For a business starting with a focused audience and a defined outreach goal.</p><p>HBI researches relevant organizations, prepares tailored outreach for your approval, coordinates the agreed follow-up and reports activity, responses and next steps.</p><p>The aim is to make a focused outreach effort easier to manage and evaluate.</p></article>
            <article className={styles.tier}><p className={styles.tierLabel}>Client Connect</p><h3>Growth</h3><p className={styles.fit}>For a business that needs deeper account research and more individualized outreach coordination.</p><p>The agreed program adds more detailed account context, message development, follow-up planning and tracking of opportunities your team qualifies.</p><p>The aim is to help your team assess and pursue promising relationships with clearer context.</p></article>
            <article className={styles.concierge}><p className={styles.tierLabel}>Client Connect</p><h3>Concierge</h3><p className={styles.fit}>For concierge healthcare practices developing carefully selected professional and referral-partner relationships.</p><p>The proposed premium program combines deeper relationship research, practice-approved messaging, closer coordination of interested responses and strategic review.</p><p>The aim is to help the practice build relevant relationships while reducing the outreach coordination carried by its clinical team.</p><p className={styles.clinical}>The practice retains clinical decisions, patient intake and care.</p></article>
        </div>
        <p className={styles.qualifier}>The right level depends on the audience, research depth and coordination required. We agree the scope, channels, schedule and fees before work begins. Results vary. Meetings, patients, sales, revenue and time savings are not guaranteed.</p>
      </div></section>
      <section className={styles.dashboard} aria-labelledby="dashboard-title"><div className={styles.inner}>
        <p className={styles.eyebrow}>A closer look at Concierge</p>
        <h2 id="dashboard-title">You can see where things stand.</h2>
        <p>Sample dashboard. All numbers, people and organizations below are fictional. This is not actual campaign performance or a forecast.</p>
        <figure className={styles.dashboardFigure}>
          <Image src="/client-connect/concierge-dashboard-v3.png" width={2160} height={1416} sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1244px) calc(100vw - 64px), 1180px" alt="Concierge Client Connect sample dashboard. A fictional four-week outreach example; a text summary and chart data follow." />
          <figcaption>
            <div className={styles.dashboardLinks}><a href="/client-connect/concierge-dashboard-v3.png">View full-size sample dashboard</a><a href="/client-connect/concierge-dashboard-v3.pdf">Open sample dashboard PDF</a></div>
            <p>In this fictional example, 120 people match the agreed audience: 100 have been contacted and 20 have not. Of the 100 contacted, 75 have no introduction or meeting discussion recorded, 15 discussed one without scheduling a meeting, 3 have an upcoming meeting and 7 have completed a meeting.</p>
            <details className={styles.chartDetails}><summary>Read the sample chart data and definitions</summary>
              <p>Running totals at each week-end for the same group of people: Week 1, 1 meeting scheduled and 0 completed; Week 2, 3 scheduled and 1 completed; Week 3, 6 scheduled and 3 completed; Week 4, 10 scheduled and 7 completed. Completed meetings are included in scheduled totals. Do not add the two lines.</p>
              <p>25 of the 100 people contacted discussed an introduction or meeting (25%). 10 of those 25 people scheduled a meeting (40%). People are counted once, even after repeat messages. Two people at one organization count as two people.</p>
              <p>Discussion means a substantive two-way human exchange about an introduction or meeting. Automatic replies and declines do not count. Example only: one meeting per person; no cancellations. Moving a meeting to another date does not add a meeting.</p>
              <p>Example next steps: for the 3 upcoming meetings, HBI confirms the time and attendees and the practice prepares for the discussion. For the 15 people who discussed an introduction or meeting without scheduling one, HBI asks whether they would like to meet and agrees a time if they do.</p>
              <p>Sample only. No actual campaign, patient or clinical data.</p>
            </details>
          </figcaption>
        </figure>
      </div></section>
      <section className={styles.scope} aria-labelledby="scope-title"><div className={styles.inner}>
        <p className={styles.eyebrow}>How HBI supports the outcome</p>
        <h2 id="scope-title">Managed outreach. Human decisions.</h2>
        <p>We agree the audience and scope, research relevant organizations, prepare tailored outreach for your approval, coordinate approved outreach and follow-up, and arrange introductions when both parties agree to connect. You approve the recipients and messages and own qualification, sales and delivery. For healthcare practices, clinical decisions, patient intake and care remain with the practice.</p>
        <p>Client Connect supports outbound relationship development. Virtual Help Desk supports incoming questions and routing. A combined engagement would have its own agreed scope.</p>
        <div className={styles.actions}><Link className={styles.primary} href={inquiry}>Discuss whether Client Connect is a fit.</Link></div>
        <p className={styles.note}>An inquiry is not a purchase, a commitment to a project or authorization to start a campaign.</p>
        <details id="how-it-works" className={styles.processDetails}>
          <summary>Explore the agreed process and examples</summary>
          <h3>How it works</h3>
          <p>Client Connect is a managed service, not self-service software or an automatically running acquisition platform. Supported channels, approvals, follow-up scope and reporting are agreed with HBI before work begins. Meetings, leads and sales are not guaranteed.</p>
          <ol className={styles.steps} role="list" aria-label="Client Connect pilot process">{clientConnectProcess.map(({ title, description, marker }, index) => {
            const Icon = processIcons[marker];
            return <li key={title}><span className={styles.marker} aria-hidden="true"><Icon size={28} weight="light" /></span><div><h3><span className={styles.stepOrder}>Step {index + 1} of {clientConnectProcess.length}: </span>{title}</h3><p>{description}</p></div></li>;
          })}</ol>
      <section className={styles.examples} aria-labelledby="examples-title"><div>
        <h2 id="examples-title">Where Client Connect could fit</h2>
        <p className={styles.examplesIntro}>Example ways small organizations could use the service. These are not actual client results.</p>
        <ul className={styles.exampleList}>
          <li><h3>Local bookkeeping or IT firm</h3><p>Reach nearby business customers through focused research, approved outreach and agreed introductions.</p></li>
          <li><h3>Workforce nonprofit</h3><p>Explore partnerships with local employers interested in hiring or supporting job-readiness programs.</p></li>
          <li><h3>Youth education nonprofit</h3><p>Connect with schools and community referral partners when the organization has capacity for more participants.</p></li>
          <li><h3>Local arts organization</h3><p>Introduce paid workshops to nearby businesses looking for team activities.</p></li>
        </ul>
        <p className={styles.examplesClosing}>HBI helps research contacts, coordinate approved outreach and track responses. Your team leads the conversations. Results are not guaranteed.</p>
      </div></section>

          <Link className={styles.secondary} href="/innovation-foundry/virtual-front-desk">Explore Virtual Help Desk</Link>
        </details>
      </div></section>
    </div>
    <SiteFooter />
  </main>;
}
