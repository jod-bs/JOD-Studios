"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "services", label: "Our Services" },
  { id: "clients", label: "Our Clients" },
  { id: "testimonials", label: "Testimonials" },
  { id: "start", label: "Start a Project" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const nodes = links
      .map((link) => document.getElementById(link.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const next = visible[0]?.target.id;
        if (next) setActive(next);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 980) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="spa-nav">
      <div className="spa-nav-bar">
        <a className="spa-brand" href="#hero" onClick={close}>
          JOD <em>Studios</em>
        </a>
        <nav className="spa-links" aria-label="Primary">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} className={active === link.id ? "is-active" : ""}>
              {link.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className={`spa-burger${open ? " is-open" : ""}`}
          aria-expanded={open}
          aria-controls="spa-drawer"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
      <nav id="spa-drawer" className={`spa-drawer${open ? " is-open" : ""}`} hidden={!open} aria-label="Mobile">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={active === link.id ? "is-active" : ""}
            onClick={close}
          >
            {link.label}
          </a>
        ))}
        <Link href="/admin" onClick={close}>
          Admin
        </Link>
      </nav>
    </header>
  );
}
