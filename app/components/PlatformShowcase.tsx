"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { CheckIcon } from "@phosphor-icons/react";
import { platformFoundation, platformProjects } from "../lib/platform-projects";

export function PlatformShowcase() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const project = platformProjects[selected];
  const nextProject = platformProjects[(selected + 1) % platformProjects.length];

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % platformProjects.length;
    else if (event.key === "ArrowLeft") next = (index + platformProjects.length - 1) % platformProjects.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = platformProjects.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return <section className="dep-showcase" id="platform" aria-labelledby="platform-title">
    <div className="eco-container">
      <p className="eco-kicker dep-origin">Developed within the HBI Innovation Foundry</p>
      <div className="dep-layout">
        <div className="dep-intro">
          <Image className="dep-logo" src="/refresh/hbi-dep-logo.png" alt="Powered by HBI Digital Experience Platform" width={1350} height={220} sizes="(max-width: 700px) 90vw, 400px" />
          <h2 id="platform-title">One platform.<br />Distinct digital<br />experiences.</h2>
          <p>The AI-powered HBI Digital Experience Platform turns strategy into working digital experiences. Built in the Foundry. Put to work in the real world.</p>
          <Link className="eco-button eco-button-light" href="/contact">Discuss your digital experience</Link>
          <ul className="dep-foundation" aria-label="Included across all three projects">{platformFoundation.map(item => <li key={item}><CheckIcon size={14} aria-hidden="true" />{item}</li>)}</ul>
        </div>
        <div className="dep-projects" id="work">
          <div className="dep-tabs" role="tablist" aria-label="Explore platform projects">
            {platformProjects.map((item, index) => <button key={item.id} id={`project-tab-${item.id}`} ref={node => { tabs.current[index] = node; }} type="button" role="tab" aria-selected={index === selected} aria-controls={`project-panel-${item.id}`} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => navigate(event, index)}>{item.label}</button>)}
          </div>
          {platformProjects.map((item, index) => <div key={item.id} id={`project-panel-${item.id}`} role="tabpanel" aria-labelledby={`project-tab-${item.id}`} hidden={index !== selected} tabIndex={0}>
            {index === selected && <>
              <div className="dep-stage">
                <a className="dep-screen dep-screen-main" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name} (opens in new tab)`}>
                  <span className="dep-browser-bar"><span aria-hidden="true">● ● ●</span>{project.domain}</span>
                  <Image src={project.image} alt={`${project.name} website homepage`} width={project.width} height={project.height} sizes="(max-width: 700px) 90vw, 44vw" />
                </a>
                <button className="dep-screen dep-screen-next" type="button" onClick={() => { const next = (selected + 1) % platformProjects.length; setSelected(next); tabs.current[next]?.focus(); }} aria-label={`Explore ${nextProject.name}`}>
                  <Image src={nextProject.image} alt="" width={nextProject.width} height={nextProject.height} sizes="(max-width: 700px) 1px, 20vw" />
                  <span>{nextProject.label}</span>
                </button>
              </div>
              <div className="dep-project-copy"><p className="eco-kicker">{project.category}</p><h3>{project.name}</h3><p>{project.summary}</p>
                <ul className="dep-capabilities" aria-label="Delivered capabilities">{project.capabilities.map(capability => <li key={capability}>{capability}</li>)}</ul>
                <p className="dep-project-detail">{project.detail}</p>
                <a className="eco-text-link" href={project.url} target="_blank" rel="noopener noreferrer">Visit {project.label === "HBI STEAM" ? "hbisteam.org" : `${project.label} website`}</a>
              </div>
            </>}
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}
