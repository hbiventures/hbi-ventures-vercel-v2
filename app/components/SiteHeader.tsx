const navigation = [
  ["Our Pillars", "/#pillars"],
  ["Impact", "/#impact"],
  ["Videos", "/#stories"],
  ["Partners", "/#partners"],
  ["Solutions", "/innovation-foundry"],
  ["About", "/#about"],
];

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="HBIVentures home">
          <span className="brand-wordmark"><b>HBI</b>Ventures</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu <span aria-hidden="true">+</span></summary>
          <nav aria-label="Mobile navigation">
            {navigation.map(([label, href]) => <a href={href} key={href}>{label}<span aria-hidden="true">↗</span></a>)}
            <a href="/contact">Connect with HBI <span aria-hidden="true">↗</span></a>
          </nav>
        </details>
        <a className="nav-cta" href="/contact">Connect With Us</a>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand"><span className="brand-symbol inverse" /><span className="brand-type"><b>HBI</b>Ventures</span></div>
      <p>Innovation · Education · Community impact</p>
      <div><a href="mailto:info@hbiventures.com">info@hbiventures.com</a><span>© {new Date().getFullYear()} HBIVentures, LLC</span></div>
    </footer>
  );
}
