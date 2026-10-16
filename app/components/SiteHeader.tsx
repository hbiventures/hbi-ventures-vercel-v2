"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChatCircleDotsIcon, EnvelopeSimpleIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import { HbiBrand } from "./HbiBrand";
import { EngagementLink } from "./EngagementLink";

const navigation = [
  ["Pillars", "/#pillars"],
  ["Platform", "/#platform"],
  ["Our work", "/#work"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

const footerNavigation = [...navigation, ["Privacy", "/privacy"]];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="hbi-header">
      <Link className="hbi-logo" href="/" aria-label="HBI Ventures home" onClick={() => setOpen(false)}>
        <HbiBrand priority />
      </Link>
      <nav className="hbi-desktop-nav" aria-label="Main navigation">
        {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>
      <EngagementLink className="eco-button hbi-header-cta" entry="header">Discuss your project</EngagementLink>
      <button className="hbi-header-navigator" type="button" aria-label="Open HBI Customer Care Assistant" onClick={() => window.dispatchEvent(new Event("hbi-open-navigator"))}><ChatCircleDotsIcon size={20} aria-hidden="true" /><span>Customer Care</span></button>
      <button className="hbi-menu-button" type="button" aria-expanded={open} aria-controls="hbi-mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} ref={menuButton} onClick={() => setOpen(!open)}>
        {open ? <XIcon size={26} /> : <ListIcon size={26} />}
      </button>
      {open && <nav className="hbi-mobile-nav" id="hbi-mobile-navigation" aria-label="Mobile navigation">
        {navigation.map(([label, href]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link href="/contact" onClick={() => setOpen(false)}>Discuss your project</Link>
      </nav>}
    </header>
  </>;
}

export function SiteFooter() {
  return <footer className="hbi-footer">
    <Link href="/" aria-label="HBI Ventures home"><HbiBrand /></Link>
    <div className="hbi-footer-center"><p>Technology. Talent. Opportunity.</p><nav aria-label="Footer navigation">{footerNavigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav></div>
    <div className="hbi-footer-contact"><a href="mailto:info@hbiventures.com"><EnvelopeSimpleIcon size={18} aria-hidden="true" />info@hbiventures.com</a><small>© {new Date().getFullYear()} HBI Ventures, LLC. All rights reserved.</small></div>
  </footer>;
}
