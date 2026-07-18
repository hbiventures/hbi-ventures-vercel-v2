const navigation = [
  ["About", "/#about"],
  ["Three Pillars", "/#pillars"],
  ["Pipeline", "/#pipeline"],
  ["Technology", "/#technology"],
  ["Stories", "/#stories"],
  ["Partners", "/#partners"],
];

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="topline">
        <p>Innovation <i /> Education <i /> Community impact</p>
        <a href="mailto:info@hbiventures.com">info@hbiventures.com <span>↗</span></a>
      </div>
      <header className="site-header">
        <a className="brand" href="/" aria-label="HBI Ventures home">
          <span className="brand-symbol" aria-hidden="true" />
          <span className="brand-type"><b>HBI</b> VENTURES</span>
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
        <a className="nav-cta" href="/contact">Connect <span>↗</span></a>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand"><span className="brand-symbol inverse" /><span className="brand-type"><b>HBI</b> VENTURES</span></div>
      <p>Innovation · Education · Community impact</p>
      <div><a href="mailto:info@hbiventures.com">info@hbiventures.com</a><span>© {new Date().getFullYear()} HBI Ventures, LLC</span></div>
    </footer>
  );
}
