"use client";

import { useEffect, useRef, useState } from "react";
import WorkObject, { type WorkKind } from "./WorkObject";

const WORKS: { kind: WorkKind; title: string; copy: string }[] = [
  {
    kind: "dubbing",
    title: "Dubbing",
    copy: "Language, breath and performance shaped until the picture believes the voice was always there.",
  },
  {
    kind: "music",
    title: "Music and Audio Mixing & Mastering",
    copy: "Score, stems and the last polish — a mix that holds together from whisper to full scale.",
  },
  {
    kind: "sfx",
    title: "SFX",
    copy: "Designed sound for impact, space and detail. Every hit, room and texture earns its weight.",
  },
  {
    kind: "vfx",
    title: "VFX",
    copy: "Shots that stay invisible, or impossible, on purpose. Finish that serves the story first.",
  },
  {
    kind: "edit",
    title: "Video Editing",
    copy: "Rhythm, structure and picture cut to the pulse of the story — nothing left that doesn’t belong.",
  },
  {
    kind: "anim",
    title: "2D & 3D Animation",
    copy: "Characters and worlds drawn and built to move with intent, from a sketch to a finished scene.",
  },
];

function easeOutExpo(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.pow(2, -10 * t);
}

export default function OurWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const indexRef = useRef<HTMLParagraphElement>(null);
  const [focus, setFocus] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    let displayed = 0;
    let focusNow = 0;

    const paint = (progress: number) => {
      const steps = WORKS.length - 1;
      const pos = Math.min(Math.max(progress, 0), 0.9999) * steps;
      const active = Math.min(steps - 1, Math.floor(pos));
      const local = pos - active;
      const travel = easeOutExpo(local);
      const incomingScale = 1 + (1 - travel) * 4.8;
      const outgoingScale = 1 - travel * 0.96;
      const nextFocus = progress > 0.999 ? WORKS.length - 1 : local > 0.42 ? active + 1 : active;

      if (nextFocus !== focusNow) {
        focusNow = nextFocus;
        setFocus(nextFocus);
      }
      if (indexRef.current) {
        const shown = progress > 0.985 ? WORKS.length - 1 : active + (local > 0.45 ? 1 : 0);
        indexRef.current.textContent = `${String(shown + 1).padStart(2, "0")} — ${String(WORKS.length).padStart(2, "0")}`;
      }

      panelRefs.current.forEach((panel, index) => {
        if (!panel) return;
        let scale = 0;
        let z = 0;
        let front = false;
        if (progress >= 0.999) {
          scale = index === WORKS.length - 1 ? 1 : 0;
          z = index === WORKS.length - 1 ? 3 : 0;
          front = index === WORKS.length - 1;
        } else if (index === active) {
          scale = outgoingScale;
          z = 4;
          front = travel < 0.42;
        } else if (index === active + 1) {
          scale = incomingScale;
          z = 3;
          front = travel >= 0.42;
        }
        panel.style.transform = `scale(${scale})`;
        panel.style.zIndex = String(z);
        panel.style.visibility = scale < 0.04 ? "hidden" : "visible";
        panel.style.pointerEvents = front ? "auto" : "none";
      });
    };

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const target = total > 0 ? scrolled / total : 0;
      displayed += (target - displayed) * 0.085;
      if (Math.abs(target - displayed) < 0.0004) displayed = target;
      paint(displayed);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

  return (
    <section id="work" ref={sectionRef} className={`our-works${reduce ? " is-static" : ""}`}>
      <div className="our-works-sticky">
        <div className="shell our-works-top">
          <p className="kicker">Our works</p>
          <p ref={indexRef} className="index">
            01 — 06
          </p>
        </div>
        <div className="our-works-stage">
          {WORKS.map((work, index) => (
            <article
              key={work.kind}
              ref={(node) => {
                panelRefs.current[index] = node;
              }}
              className={`our-works-panel${index === 0 ? " is-front" : ""}`}
            >
              <div className="our-works-copy">
                <p className="eyebrow">0{index + 1}</p>
                <h3>{work.title}</h3>
                <p>{work.copy}</p>
                <span>Drag the object</span>
              </div>
              <div className="our-works-visual">
                <WorkObject kind={work.kind} playing={reduce || Math.abs(index - focus) <= 1} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
