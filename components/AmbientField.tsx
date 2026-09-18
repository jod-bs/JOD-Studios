"use client";

import { useEffect, useRef } from "react";
import styles from "./AmbientField.module.css";

type Variant = "nebula" | "film" | "wave" | "bloom";

export default function AmbientField({ variant = "nebula" }: { variant?: Variant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0, pointer = { x: 0.5, y: 0.5 }, size = { w: 0, h: 0 };
    const resize = () => { const rect = canvas.getBoundingClientRect(); const scale = Math.min(devicePixelRatio, 1.5); size = { w: rect.width, h: rect.height }; canvas.width = size.w * scale; canvas.height = size.h * scale; context.setTransform(scale, 0, 0, scale, 0, 0); };
    const move = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); pointer = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height }; };
    const draw = (time: number) => { const { w, h } = size; context.clearRect(0, 0, w, h); const t = time / 1000;
      if (variant === "film") { for (let i = 0; i < 18; i++) { const x = ((i * 97 + t * 20) % (w + 120)) - 60; context.fillStyle = `rgba(208,83,224,${0.025 + (i % 3) * .015})`; context.fillRect(x, 0, 1, h); } }
      else { const palette = variant === "bloom" ? ["206,83,224", "131,53,143"] : variant === "wave" ? ["91,17,102", "206,83,224"] : ["131,53,143", "206,83,224"]; for (let i = 0; i < 5; i++) { const x = w * (.18 + i * .19) + Math.sin(t * (.35 + i * .08) + i) * w * .1 + (pointer.x - .5) * 65; const y = h * (.4 + Math.cos(t * .32 + i * 1.8) * .18) + (pointer.y - .5) * 45; const radius = Math.min(w, h) * (.13 + i * .022); const grad = context.createRadialGradient(x, y, 0, x, y, radius); grad.addColorStop(0, `rgba(${palette[i % 2]},${.12 - i * .012})`); grad.addColorStop(1, `rgba(${palette[i % 2]},0)`); context.fillStyle = grad; context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.fill(); } }
      if (variant === "wave") { context.strokeStyle = "rgba(235,157,244,.22)"; context.lineWidth = 1; for (let row = 0; row < 5; row++) { context.beginPath(); for (let x = 0; x <= w; x += 12) { const y = h * (.2 + row * .16) + Math.sin(x / 80 + t * 1.4 + row) * 18 + Math.sin(x / 31 - t) * 5; x ? context.lineTo(x, y) : context.moveTo(x, y); } context.stroke(); } }
      frame = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); window.addEventListener("pointermove", move, { passive: true }); frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); };
  }, [variant]);
  return <canvas ref={canvasRef} className={styles.field} aria-hidden="true" />;
}
