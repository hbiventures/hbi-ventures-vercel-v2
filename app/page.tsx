import { SiteFooter, SiteHeader } from "./components/SiteHeader";

const pillars = [
  {
    number: "01",
    label: "Learn",
    title: "HBI STEAM Academy",
    copy: "Future-ready talent development through hands-on, project-based learning tied to real industry and community challenges.",
    points: ["Project-based learning", "Industry-aligned skills", "Mentorship & pathways"],
    color: "cyan",
  },
  {
    number: "02",
    label: "Build",
    title: "HBI Innovation Foundry",
    copy: "Applied product development and commercialization across AI, IoT, cybersecurity, data, and connected systems.",
    points: ["Prototype development", "Market validation", "Innovation hubs"],
    color: "blue",
  },
  {
    number: "03",
    label: "Include",
    title: "HBI Foundation",
    copy: "Equitable access, scholarships, mentorship, and community engagement that broaden participation in innovation.",
    points: ["Scholarships & access", "Community programs", "Sustained impact"],
    color: "orange",
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
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><span>●</span> Innovation and impact organization</p>
            <h1>Building tomorrow’s<br />technologies.<br /><em>Developing its leaders.</em></h1>
            <p className="hero-intro">HBI Ventures creates a continuous pipeline from talent development to applied innovation, workforce opportunity, and measurable community outcomes.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#pillars">Explore the ecosystem <span>↓</span></a>
              <a className="button button-ghost" href="mailto:info@hbiventures.com?subject=Partnership%20inquiry">Partner with HBI <span>↗</span></a>
            </div>
          </div>

          <div className="ecosystem" aria-label="HBI technology and talent ecosystem">
            <div className="eco-ring ring-a" />
            <div className="eco-ring ring-b" />
            <div className="eco-core">
              <small>THE HBI ENGINE</small>
              <strong>Technology<br /><i>×</i> Talent</strong>
              <span>Impact at scale</span>
            </div>
            <div className="eco-node node-one"><b>AI</b><span>Intelligence</span></div>
            <div className="eco-node node-two"><b>IoT</b><span>Smart systems</span></div>
            <div className="eco-node node-three"><b>CY</b><span>Cyber trust</span></div>
            <div className="eco-node node-four"><b>UX</b><span>Product design</span></div>
          </div>

          <div className="hero-stats">
            <div><strong>320+</strong><span>Students served</span></div>
            <div><strong>80+</strong><span>Student prototypes</span></div>
            <div><strong>2016</strong><span>Year launched</span></div>
            <div><strong>3</strong><span>Integrated pillars</span></div>
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

        <section className="pillars-section" id="pillars">
          <div className="section-heading light-heading">
            <div><p className="eyebrow"><span>●</span> The HBI ecosystem</p><h2>Three pillars.<br />One pipeline.</h2></div>
            <p>From first exposure to scaled innovation, HBI creates the conditions for talent and technology to grow together.</p>
          </div>
          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <article className={`pillar-card ${pillar.color}`} key={pillar.number}>
                <div className="pillar-top"><span>{pillar.number}</span><b>{pillar.label}</b></div>
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
                <ul>{pillar.points.map((point) => <li key={point}>{point}</li>)}</ul>
                <a href={pillar.number === "01" ? "/steam-academy" : pillar.number === "02" ? "/innovation-foundry" : "/foundation"}>Explore this pillar <span>↗</span></a>
              </article>
            ))}
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
            <img src="/acrb-ai-project.png" alt="HBI STEAM Academy students presenting an AI solution" />
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
