/** Owner-confirmed delivery scope; no simulated metrics or inferred outcomes. */
export const platformProjects = [
  {
    id: "lia", label: "LIA", name: "Learning Innovation Alliance",
    category: "Education · Entrepreneurship · Workforce",
    url: "https://learninginnovationalliance.org", domain: "learninginnovationalliance.org",
    image: "/refresh/lia-website.png", width: 1440, height: 1000,
    summary: "A connected digital home for learning, entrepreneurship and economic opportunity.",
    focus: "Connect learning content with participation and campaign decisions.",
    experience: "Visitors can explore video content, use custom forms and access payment pathways. Site and campaign reporting supports the next strategy decision.",
    capabilities: ["Video content integration", "Custom form integration", "Payment integration", "Site & campaign analytics", "Reporting", "Analytics-informed campaign strategy"],
    detail: "The website is part of a wider engagement strategy. Site and campaign analytics, reporting and audience insight inform the next campaign decisions.",
  },
  {
    id: "ejc", label: "EJC", name: "Experience Jesus Christ Ministries",
    category: "Community · Ministry · Digital engagement",
    url: "https://experiencejesuschrist.org", domain: "experiencejesuschrist.org",
    image: "/refresh/ejc-website.png", width: 1280, height: 720,
    summary: "An immersive ministry experience connecting people with information, gatherings and support.",
    focus: "Help visitors move from ministry information to their next step.",
    experience: "Ask EJC guides visitors to information. Calendar-backed gatherings, external booking links and giving pathways connect the experience, with analytics and reporting.",
    capabilities: ["Cinematic motion & 3D", "Ask EJC virtual assistant", "Calendar API integration", "Automated gathering updates", "Booking & giving pathways", "Analytics & reporting"],
    detail: "Ask EJC helps visitors find ministry information. Calendar integration keeps gatherings current, with booking links and giving options connecting visitors to their next step.",
  },
  {
    id: "steam", label: "HBI STEAM", name: "HBI STEAM Digital Experience",
    category: "Education · Talent · Opportunity",
    url: "https://hbisteam.org", domain: "hbisteam.org",
    image: "/refresh/hbi-steam-website.png", width: 1280, height: 720,
    summary: "A dedicated digital destination that brings the HBI STEAM Academy story to life.",
    focus: "Give the Academy a dedicated home for its story and programs.",
    experience: "Motion-led storytelling and responsive pages bring Academy content together on its own hosted site, supported by analytics and reporting.",
    capabilities: ["Immersive website design", "Motion-led storytelling", "Responsive development", "Platform hosting", "Analytics & reporting"],
    detail: "Explore the full Academy experience on hbisteam.org. Programs, student projects and learning opportunities now live on that dedicated site.",
  },
] as const;

export const platformFoundation = ["Designed", "Built", "Hosted", "Analytics & reporting"] as const;

/** Separate from platformProjects: scoped Shopify UI/UX work, not HBI hosting
 * or analytics delivery. Uses the final created scene from the delivered homepage. */
export const focusPortfolioProject = {
  id: "focus", label: "FOCUS-I-APPAREL", name: "FOCUS-I-APPAREL",
  storyTitle: "From brand story to shopping",
  category: "UI/UX · Shopify storefront",
  url: "https://www.focusiapparel.com/", domain: "www.focusiapparel.com",
  image: "/portfolio/focus-storefront.png", width: 1536, height: 1024,
  imageAlt: "Illustrative storefront scene used in the FOCUS-I-APPAREL homepage design.",
  summary: "A branded homepage refresh with a direct Shop all entry into the existing Shopify catalog.",
  focus: "Present the apparel brand and connect its homepage story with existing product-discovery paths.",
  capabilities: ["Homepage layout and visual hierarchy", "Preserved Shop all navigation into existing catalog and product pages", "Journal Coming Soon presentation", "Desktop and mobile layout iteration"],
  experience: "Visitors move from the branded homepage through Shop all to the existing Shopify catalog and product pages. A separate journal announcement uses Coming Soon.",
  detail: "HBI refined the presentation within the existing Shopify storefront. The store retains its Shopify hosting, catalog, cart and checkout infrastructure; the portfolio scope is the homepage presentation and entry into those shopping paths.",
} as const;
