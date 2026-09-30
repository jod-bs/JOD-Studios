"use client";

import { useEffect, useRef } from "react";

const frames = [
  { src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=700&q=70", alt: "Studio microphone" },
  { src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=700&q=70", alt: "Music studio" },
  { src: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=70", alt: "Vocal recording" },
  { src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=700&q=70", alt: "Camera on set" },
  { src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=70", alt: "Film production" },
  { src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=700&q=70", alt: "Editing suite" },
  { src: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=700&q=70", alt: "Cinema screen" },
  { src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=700&q=70", alt: "Studio headphones" },
];

function wrap(index: number, cursor: number, count: number) {
  let delta = index - cursor;
  delta = ((delta % count) + count) % count;
  if (delta > count / 2) delta -= count;
  return delta;
}

function damp(current: number, target: number, dt: number, lambda: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export default function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const shots = useRef<(HTMLElement | null)[]>([]);
  const faces = useRef<(HTMLElement | null)[]>([]);
  const glows = useRef<(HTMLElement | null)[]>([]);
  const hover = useRef(-1);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const count = frames.length;
    const lifts = new Array(count).fill(0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cursor = 0;
    let velocity = reduce ? 0 : 0.22;
    let last = performance.now();
    let frame = 0;

    const layout = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const targetSpeed = !reduce && hover.current < 0 ? 0.22 : 0;
      velocity = damp(velocity, targetSpeed, dt, 6);
      cursor += velocity * dt;

      const width = stage.clientWidth || 1;
      const card = shots.current[0]?.offsetWidth || 156;
      const spacing = Math.max(card * 0.86, Math.min(card * 1.02, width / 7.4));

      for (let index = 0; index < count; index += 1) {
        const shot = shots.current[index];
        const face = faces.current[index];
        const glow = glows.current[index];
        if (!shot || !face) continue;

        const delta = wrap(index, cursor, count);
        const distance = Math.abs(delta);
        const depth = Math.min(distance, 3.15) / 3.15;
        lifts[index] = damp(lifts[index], hover.current === index ? 1 : 0, dt, 14);

        const scale = (0.7 + depth * 0.55) * (1 + lifts[index] * 0.1);
        const z = -150 + depth * 230 + lifts[index] * 56;
        const rot = Math.max(-26, Math.min(26, -delta * 15));
        const x = delta * spacing;
        const y = -8 * depth - lifts[index] * 22;
        const visible = distance < 4.15;

        shot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        shot.style.zIndex = String(Math.round(depth * 30 + lifts[index] * 8));
        shot.style.visibility = visible ? "visible" : "hidden";
        face.style.transform = `translate3d(0, 0, ${z}px) rotateY(${rot}deg) scale(${scale})`;
        if (glow) glow.style.opacity = String(lifts[index] * 0.95);
      }

      stage.dataset.ready = "true";
      frame = requestAnimationFrame(layout);
    };

    frame = requestAnimationFrame(layout);
    return () => cancelAnimationFrame(frame);
  }, []);

    return (
    <div className="ag-stage" aria-label="Studio work carousel">
      <div className="ag-stage-scene" ref={stageRef}>
      {frames.map((frame, index) => (
        <div
          key={frame.src}
          className="ag-shot"
          ref={(node) => {
            shots.current[index] = node;
          }}
        >
          <span
            className="ag-shot-glow"
            ref={(node) => {
              glows.current[index] = node;
            }}
            aria-hidden="true"
          />
          <div
            className="ag-shot-card"
            ref={(node) => {
              faces.current[index] = node;
            }}
            onPointerEnter={() => {
              hover.current = index;
            }}
            onPointerLeave={() => {
              if (hover.current === index) hover.current = -1;
            }}
          >
            <img src={frame.src} alt={frame.alt} draggable={false} />
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
