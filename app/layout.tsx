import type { Metadata } from "next";
import "./globals.css";
import { Chatbot } from "./components/Chatbot";

export const metadata: Metadata = {
  metadataBase: new URL("https://hbi-ventures.io"),
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
    <html lang="en">
      <body>{children}<Chatbot /></body>
    </html>
  );
}
