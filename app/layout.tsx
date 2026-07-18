import type { Metadata } from "next";
import "./globals.css";
import { Chatbot } from "./components/Chatbot";

export const metadata: Metadata = {
  metadataBase: new URL("https://hbi-ventures.io"),
  title: "HBI Ventures — Innovation, Talent & Community Impact",
  description: "HBI Ventures builds, tests, and scales emerging technologies while developing diverse technical talent through three integrated pillars.",
  openGraph: {
    title: "HBI Ventures — Building Technology. Developing Leaders.",
    description: "Innovation, education, and community impact in one connected ecosystem.",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "HBI Ventures innovation and impact ecosystem" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HBI Ventures — Innovation, Talent & Community Impact",
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
