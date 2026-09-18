"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 760) setOpen(false);
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
    <header className="shell nav">
      <a className="wordmark" href="#top" onClick={close}>
        JOD <em>STUDIOS</em>
      </a>

      <nav className="nav-desktop" aria-label="Primary">
        <a href="#work">Work</a>
        <a href="#rooms">Rooms</a>
        <a href="#start">Start a project</a>
        <Link href="/admin" className="admin-nav-link">
          Admin Portal
        </Link>
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          className={`nav-toggle ${open ? "open" : ""}`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <a className="circle-link" href="#start" aria-label="Start a project" onClick={close}>
          ↗
        </a>
      </div>

      <div id="mobile-nav" className={`mobile-nav ${open ? "open" : ""}`} hidden={!open}>
        <a href="#work" onClick={close}>
          Work
        </a>
        <a href="#rooms" onClick={close}>
          Rooms
        </a>
        <a href="#start" onClick={close}>
          Start a project
        </a>
        <Link href="/admin" className="admin-nav-link" onClick={close}>
          Admin Portal
        </Link>
      </div>
    </header>
  );
}
