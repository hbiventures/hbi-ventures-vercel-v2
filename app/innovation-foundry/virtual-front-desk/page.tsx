import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../../components/SiteHeader";
import { parseVirtualFrontDeskIndustry } from "../../lib/virtual-front-desk";
import { VirtualFrontDeskClient } from "./VirtualFrontDeskClient";

export const metadata: Metadata = {
  title: "Virtual Help Desk for Small Businesses | HBI Innovation Foundry",
  description: "Explore HBI Virtual Help Desk: approved answers and clear customer next steps. Connect existing tools or let HBI build your digital experience and workflow end to end.",
  alternates: { canonical: "/innovation-foundry/virtual-front-desk" },
  openGraph: {
    title: "Virtual Help Desk — built on the HBI Digital Experience Platform",
    description: "Connect your existing customer journey or build a new digital experience and workflow with HBI Innovation Foundry.",
    url: "/innovation-foundry/virtual-front-desk",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "HBI Virtual Help Desk by HBI Innovation Foundry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Help Desk for Small Businesses | HBI Innovation Foundry",
    description: "Approved answers, clear customer next steps and connected workflows built around your organization.",
    images: ["/og.png"],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.hbiventures.com/innovation-foundry/virtual-front-desk#service",
  name: "HBI Virtual Help Desk",
  serviceType: "Digital customer care and inquiry workflow",
  url: "https://www.hbiventures.com/innovation-foundry/virtual-front-desk",
  description: "HBI Virtual Help Desk helps customers get approved answers, understand the right service and take a clear next step.",
  provider: {
    "@type": "Organization",
    name: "HBI Ventures",
    url: "https://www.hbiventures.com/",
  },
  audience: { "@type": "BusinessAudience", audienceType: "Small and midsize organizations" },
  areaServed: { "@type": "Country", name: "United States" },
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function VirtualFrontDeskPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const initialIndustry = parseVirtualFrontDeskIndustry(first(query.industry));
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
    <SiteHeader />
    <div id="main-content" tabIndex={-1}>
      <VirtualFrontDeskClient
        initialIndustry={initialIndustry}
        rawCity={first(query.city)}
        rawCampaign={first(query.utm_campaign)}
        rawContent={first(query.utm_content)}
      />
    </div>
    <SiteFooter />
  </main>;
}
