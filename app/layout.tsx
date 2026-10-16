import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import "./ecosystem.css";
import "./brand.css";
import "./navigator.css";
import "./workflow-theatre.css";
import { Chatbot } from "./components/Chatbot";
import { PostHogProvider } from "./PostHogProvider";

export const metadata: Metadata = {
  icons: { icon: "/refresh/hbi-logo.png" },
  metadataBase: new URL("https://www.hbiventures.com"),
  title: "HBI Ventures — Technology, Talent & Opportunity",
  description: "HBI Ventures connects applied technology, talent development and community opportunity through the HBI Innovation Foundry, HBI STEAM Academy and HBI Foundation.",
  openGraph: {
    title: "HBI Ventures — Technology, Talent & Opportunity",
    description: "One ecosystem connecting practical technology, future-ready talent and broader access to opportunity.",
    siteName: "HBI Ventures",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "HBI Ventures technology, talent and opportunity ecosystem" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HBI Ventures — Technology, Talent & Opportunity",
    description: "One ecosystem connecting practical technology, future-ready talent and broader access to opportunity.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><PostHogProvider>{children}<Chatbot /></PostHogProvider></body>
    </html>
  );
}
