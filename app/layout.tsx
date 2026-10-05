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
  title: "HBIVentures — Innovation, Talent & Community Impact",
  description: "HBIVentures builds, tests, and scales emerging technologies while developing diverse technical talent through three integrated pillars.",
  openGraph: {
    title: "HBIVentures — Building Technology. Developing Leaders.",
    description: "Innovation, education, and community impact in one connected ecosystem.",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "HBIVentures innovation and impact ecosystem" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HBIVentures — Innovation, Talent & Community Impact",
    description: "Building tomorrow’s technologies. Developing tomorrow’s leaders.",
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
