import { SiteFooter, SiteHeader } from "./components/SiteHeader";

const pillars = [
  {
    number: "01",
    icon: "🎓",
    title: "HBI STEAM Academy",
    copy: "Preparing middle and high school students for college, careers, and entrepreneurship through hands-on challenges in AI, data science, cybersecurity, IoT, connected systems, product development, digital media, and business.",
    action: "Sponsor a Cohort",
    href: "/steam-academy",
  },
  {
    number: "02",
    icon: "⚙️",
    title: "HBI Innovation Foundry",
    copy: "Helping organizations transform ideas into practical solutions through AI-enabled products, connected devices, data-driven decision tools, virtual assistants, rapid prototyping, and emerging-technology strategy.",
    action: "Explore Solutions",
    href: "/innovation-foundry",
  },
  {
    number: "03",
    icon: "🤝",
    title: "HBI Foundation",
    copy: "Expanding access to high-quality education and innovation opportunities through charitable giving, corporate partnerships, scholarships, community programs, and mission-aligned investment.",
    action: "Support the Mission",
    href: "/foundation",
  },
];

const technologies = [
  ["AI", "Artificial intelligence & data science"],
  ["IoT", "Connected devices & smart systems"],
  ["CY", "Cybersecurity & digital trust"],
  ["CM", "Connected mobility"],
  ["PX", "Product innovation & UX"],
  ["CT", "Creative technology & media"],
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <div id="main-content">
        <section className="reference-hero" id="top">
          <div className="reference-hero-inner">
            <div className="reference-hero-copy">
              <p className="reference-kicker">AI-first innovation · Emerging technology · Community impact</p>
              <h1>Turning emerging<br />technology into<br />real-world<br />opportunity.</h1>
              <p className="reference-intro">HBIVentures applies an AI-first, human-centered mindset to connect education, industry, and community through artificial intelligence, data science, connected mobility, Internet of Things, smart-city innovation, and technology-enabled product development.</p>
              <div className="reference-tags"><span>Artificial Intelligence</span><span>Smart Cities</span><span>Connected Car</span><span>IoT</span><span>Data Science</span></div>
              <div className="reference-actions">
                <a className="reference-primary" href="#pillars">Explore Our Work</a>
                <a className="reference-secondary" href="/contact">Partner With HBI</a>
              </div>
              <div className="reference-stats">
                <div><strong>320+</strong><span>Students Served</span></div>
                <div><strong>80+</strong><span>Student Prototypes</span></div>
                <div><strong>Since 2016</strong><span>Creating Impact</span></div>
              </div>
            </div>
            <div className="reference-orbit" aria-label="HBI technology ecosystem">
              <div className="orbit-ring orbit-ring-one" />
              <div className="orbit-ring orbit-ring-two" />
              <div className="orbit-core">HBI</div>
              <div className="orbit-card orbit-ai"><b>AI</b><strong>Intelligent Systems</strong></div>
              <div className="orbit-card orbit-iot"><b>IoT</b><strong>Connected Technology</strong></div>
              <div className="orbit-card orbit-data"><b>DATA</b><strong>Insight &amp; Innovation</strong></div>
              <i className="orbit-dot dot-one" /><i className="orbit-dot dot-two" /><i className="orbit-dot dot-three" />
            </div>
          </div>
        </section>

        <section className="reference-pillars" id="pillars">
          <div className="reference-section-heading">
            <p className="reference-kicker">Our three pillars</p>
            <h2>One vision. Three engines for<br />impact.</h2>
            <p>Each pillar advances a distinct part of the HBI mission while working together to create stronger pathways from learning to opportunity.</p>
          </div>
          <div className="reference-pillar-grid">
            {pillars.map((pillar) => (
              <article className={pillar.number === "02" ? "reference-pillar-card featured" : "reference-pillar-card"} key={pillar.number}>
                <div className="reference-pillar-top"><span>{pillar.icon}</span><b>{pillar.number}</b></div>
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
                <a href={pillar.href}>{pillar.action} <span>→</span></a>
              </article>
            ))}
          </div>
        </section>

        <section className="mobile-explore" aria-labelledby="mobile-explore-title">
          <p className="reference-kicker">Continue your journey</p>
          <h2 id="mobile-explore-title">Go directly to what matters to you.</h2>
          <p>Explore HBI’s model, technology capabilities, and portfolio without working through every detail on the home page.</p>
          <div>
            <a href="/about"><strong>How HBI works</strong><span>Mission, model, and impact →</span></a>
            <a href="/innovation-foundry"><strong>Technology solutions</strong><span>AI, IoT, data, and product strategy →</span></a>
            <a href="/portfolio"><strong>Innovation portfolio</strong><span>Projects, prototypes, and applied work →</span></a>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="section-kicker"><span>01</span><p>One connected organization</p></div>
          <div className="about-main">
            <h2>Innovation works best when <em>opportunity is built in.</em></h2>
            <div className="about-copy">
              <p>We connect education, product development, commercialization, workforce pathways, equitable access, and community outcomes.</p>
              <p>Each HBI pillar has a distinct job. Together, they create an ecosystem where people learn, ideas become products, and progress reaches the communities it should serve.</p>
            </div>
          </div>
        </section>

        <section className="pipeline-section" id="pipeline">
          <div className="pipeline-copy">
            <p className="eyebrow dark-eyebrow"><span>●</span> The HBI pipeline</p>
            <h2>From first spark to lasting impact.</h2>
          </div>
          <div className="pipeline-flow">
            <article><b>01</b><span>Discover</span><p>Explore future technologies and opportunity pathways.</p></article>
            <i>→</i>
            <article><b>02</b><span>Develop</span><p>Build technical, creative, leadership, and product skills.</p></article>
            <i>→</i>
            <article><b>03</b><span>Build & test</span><p>Prototype solutions around real-world challenges.</p></article>
            <i>→</i>
            <article><b>04</b><span>Scale impact</span><p>Move talent, products, and partnerships into the world.</p></article>
          </div>
        </section>

        <section className="technology-section" id="technology">
          <div className="tech-intro">
            <div className="section-kicker"><span>02</span><p>Technology focus</p></div>
            <h2>Globally informed.<br /><em>Locally relevant.</em></h2>
            <p>We build capability in the technologies shaping industries—then apply them to challenges that matter here and now.</p>
          </div>
          <div className="tech-grid">
            {technologies.map(([abbr, title], index) => (
              <article key={abbr} className={index === 0 ? "featured-tech" : ""}>
                <span>{abbr}</span><h3>{title}</h3><b>0{index + 1}</b>
              </article>
            ))}
          </div>
        </section>

        <section className="featured-section">
          <div className="featured-image">
            <img src="/student-presentation.jpg" alt="HBI students presenting their work in a professional classroom" />
            <span>HBI STEAM ACADEMY · APPLIED AI</span>
          </div>
          <div className="featured-copy">
            <p className="eyebrow"><span>●</span> Innovation in action</p>
            <h2>Students using AI to solve civic and community challenges.</h2>
            <p>HBI teams research user needs, shape technology concepts, build prototypes, and present solutions to professionals and community stakeholders.</p>
            <div className="feature-tags"><span>Research</span><span>AI-first mindset</span><span>Prototyping</span><span>Storytelling</span></div>
            <a className="arrow-link" href="mailto:info@hbiventures.com?subject=HBI%20innovation%20portfolio">Explore the innovation portfolio <span>↗</span></a>
          </div>
        </section>

        <section className="impact-section" id="impact">
          <div className="impact-title">
            <p className="eyebrow dark-eyebrow"><span>●</span> A decade of progress</p>
            <h2>Impact is the<br />output that matters.</h2>
          </div>
          <div className="impact-numbers">
            <article><strong>320<sup>+</sup></strong><p>Students served through innovation-centered learning.</p></article>
            <article><strong>80<sup>+</sup></strong><p>Student prototypes designed around real challenges.</p></article>
            <article><strong>10<sup>yrs</sup></strong><p>Developing talent and community-centered innovation.</p></article>
          </div>
        </section>

        <section className="home-stories" id="stories">
          <div className="section-heading">
            <div><p className="eyebrow dark-eyebrow"><span>●</span> Partners in action</p><h2>See the work.<br />Meet the partners.</h2></div>
            <p>Stories of technology, sport, learning, and collaboration—available directly as you move down the home page.</p>
          </div>
          <div className="home-video-grid">
            <article>
              <div className="home-video embedded-video"><iframe src="https://www.youtube.com/embed/U9mMioFsEB0?si=sjlYGTBs5PZWeBAy" title="Metric Mate on Shark Tank" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
              <div><a className="partner-logo-link" href="https://www.themetricmate.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Metric Mate"><img className="story-partner-logo metric-logo" src="/metric-mate-logo.jpg" alt="Metric Mate"/></a><p className="eyebrow dark-eyebrow"><span>●</span> Performance technology</p><h3>Metric Mate</h3><p>See how connected fitness, athlete assessments, and applied analytics create new pathways into sports technology and digital health.</p><a href="https://youtu.be/U9mMioFsEB0?si=uBhLv_DAGIAqyc4c" target="_blank" rel="noopener noreferrer">Watch the Metric Mate video <span>↗</span></a></div>
            </article>
            <article>
              <div className="home-video embedded-video"><iframe src="https://www.youtube.com/embed/zdBmtdo4v7Q" title="Soccer IQ Institute — Innovation Through Sport" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
              <div><a className="partner-logo-link" href="https://www.socceriqinstitute.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Soccer IQ Institute"><img className="story-partner-logo soccer-logo" src="/soccer-iq-logo.png" alt="Soccer IQ Institute"/></a><p className="eyebrow dark-eyebrow"><span>●</span> Innovation through sport</p><h3>Soccer IQ Institute</h3><p>Explore youth development, sports technology, connected devices, data-informed performance, and holistic coaching.</p><a href="https://www.socceriqinstitute.com/" target="_blank" rel="noopener noreferrer">Visit Soccer IQ Institute <span>↗</span></a></div>
            </article>
          </div>
        </section>

        <section className="partners-section" id="partners">
          <div className="partners-copy"><p className="eyebrow"><span>●</span> Innovation network</p><h2>Partnership powers every stage.</h2><p>Education, technology, healthcare, sports, media, and community partners bring expertise and opportunity into the HBI pipeline.</p><a href="/partners">Explore the complete partner network <span>↗</span></a></div>
          <div className="home-partner-logos">
            <a href="https://www.themetricmate.com/" target="_blank" rel="noopener noreferrer"><img src="/metric-mate-logo.jpg" alt="Metric Mate"/><span>Performance technology</span></a>
            <a href="https://www.socceriqinstitute.com/" target="_blank" rel="noopener noreferrer"><img src="/soccer-iq-logo.png" alt="Soccer IQ Institute"/><strong>Soccer IQ Institute</strong><span>Sports technology</span></a>
            <a href="https://www.famincorporated.org/" target="_blank" rel="noopener noreferrer"><img src="/fam-logo.png" alt="FAM Incorporated"/><strong>FAM Incorporated</strong><span>Arts education & creative media</span></a>
            <a href="https://www.orthoproject.org/" target="_blank" rel="noopener noreferrer"><img src="/ortho-project.png" alt="The ORTHO Project"/><span>Healthcare & sports medicine</span></a>
            <a className="lewis-tile" href="https://www.thelewisregistry.org/" target="_blank" rel="noopener noreferrer"><img src="/lewis-registry-logo.png" alt="The LEWIS Registry"/><strong>The LEWIS Registry</strong><span>Civic & community innovation</span></a>
          </div>
        </section>

        <section className="contact-section">
          <p className="eyebrow"><span>●</span> Build the future with us</p>
          <h2>Bring the challenge.<br /><em>We’ll build the pathway.</em></h2>
          <a href="mailto:info@hbiventures.com?subject=Partnership%20inquiry">Start a conversation <span>↗</span></a>
          <div className="contact-orbit" />
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
