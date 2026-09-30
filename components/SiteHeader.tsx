"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Works" },
  { href: "#process", label: "Process" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const work = document.getElementById("work");
      if (!work) return;
      const rect = work.getBoundingClientRect();
      setCovered(rect.top < 72 && rect.bottom > 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 860) setOpen(false);
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
    <header className={`ag-nav${scrolled ? " is-scrolled" : ""}${covered ? " is-covered" : ""}`}>
      <a className="ag-brand" href="#top" onClick={close}>
        JOD <em>Studios</em>
      </a>
      <nav className="ag-nav-links" aria-label="Primary">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
        <Link href="/admin">Admin</Link>
      </nav>
      <div className="ag-nav-end">
        <a className="ag-pill" href="#start">
          Start a project
        </a>
        <button
          type="button"
          className={`ag-burger${open ? " is-open" : ""}`}
          aria-expanded={open}
          aria-controls="ag-drawer"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
      <div id="ag-drawer" className={`ag-drawer${open ? " is-open" : ""}`} hidden={!open}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={close}>
            {link.label}
          </a>
        ))}
        <Link href="/admin" onClick={close}>
          Admin
        </Link>
        <a className="ag-pill" href="#start" onClick={close}>
          Start a project
        </a>
      </div>
    </header>
  );
}
