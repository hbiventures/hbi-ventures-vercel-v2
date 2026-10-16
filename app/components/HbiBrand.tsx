import Image from "next/image";

/** Original shared HBI emblem from the Academy; Ventures keeps its own name. */
export function HbiBrand({ priority = false }: { priority?: boolean }) {
  return <span className="hbi-brand-lockup" aria-hidden="true">
    <Image src="/refresh/hbi-emblem-engraved.png" alt="" width={360} height={432} sizes="64px" priority={priority} />
    <span className="hbi-brand-name"><strong>HBI</strong><span>Ventures</span></span>
  </span>;
}
