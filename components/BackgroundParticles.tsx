"use client";

import { useEffect, useRef } from "react";

const COLORS = ["168, 61, 184", "107, 42, 118", "214, 150, 222", "240, 178, 247", "74, 21, 79"];

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  phase: number;
};

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const seed = () => {
      const count = Math.round(Math.min(130, Math.max(48, width / 12)));
      particles = Array.from({ length: count }, () => {
        const soft = Math.random() < 0.1;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: soft ? 22 + Math.random() * 48 : 0.7 + Math.random() * 1.7,
          vx: (Math.random() - 0.5) * (soft ? 0.08 : 0.2),
          vy: -(soft ? 0.05 : 0.08 + Math.random() * 0.2),
          alpha: soft ? 0.08 + Math.random() * 0.08 : 0.25 + Math.random() * 0.45,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * scale);
      canvas.height = Math.floor(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      seed();
    };

    const paint = (time: number) => {
      context.clearRect(0, 0, width, height);
      const seconds = time / 1000;
      for (const particle of particles) {
        if (!reduce) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.y < -particle.r) particle.y = height + particle.r;
          if (particle.x < -particle.r) particle.x = width + particle.r;
          if (particle.x > width + particle.r) particle.x = -particle.r;
        }
        const flicker = particle.r < 12 ? 0.6 + Math.sin(seconds * 1.3 + particle.phase) * 0.4 : 1;
        const alpha = particle.alpha * flicker;
        const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.r);
        gradient.addColorStop(0, `rgba(${particle.color}, ${alpha})`);
        gradient.addColorStop(1, `rgba(${particle.color}, 0)`);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fill();
      }
    };

    const loop = (time: number) => {
      if (document.hidden) {
        frame = requestAnimationFrame(loop);
        return;
      }
      paint(time);
      frame = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduce) paint(0);
    else frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="bg-particles" aria-hidden="true" />;
}
