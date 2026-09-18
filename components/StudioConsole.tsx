"use client";

import { useEffect, useRef } from "react";
import styles from "./GalaxyCore.module.css";

type Star = { orbit: number; angle: number; speed: number; lift: number; size: number; hue: number };

export default function StudioConsole() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const stars: Star[] = Array.from({ length: 780 }, (_, index) => ({ orbit: 12 + Math.pow(Math.random(), .55) * 220, angle: Math.random() * Math.PI * 2, speed: .00012 + Math.random() * .00038, lift: (Math.random() - .5) * 32, size: .35 + Math.random() * 1.9, hue: index % 9 === 0 ? 318 : index % 5 === 0 ? 275 : 292 }));
    let raf = 0, mouse = { x: 0, y: 0 }, dims = { w: 0, h: 0 };
    const resize = () => { const rect = canvas.getBoundingClientRect(), scale = Math.min(devicePixelRatio, 1.6); dims = { w: rect.width, h: rect.height }; canvas.width = dims.w * scale; canvas.height = dims.h * scale; ctx.setTransform(scale, 0, 0, scale, 0, 0); };
    const pointer = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); mouse = { x: (event.clientX - rect.left) / rect.width - .5, y: (event.clientY - rect.top) / rect.height - .5 }; };
    const draw = (time: number) => { const { w, h } = dims, cx = w * .51 + mouse.x * 34, cy = h * .5 + mouse.y * 28, tilt = .53 + mouse.y * .22; ctx.clearRect(0, 0, w, h);
      const aura = ctx.createRadialGradient(cx, cy, 4, cx, cy, Math.min(w, h) * .46); aura.addColorStop(0, "rgba(255,198,255,.28)"); aura.addColorStop(.12, "rgba(213,77,229,.17)"); aura.addColorStop(.48, "rgba(101,25,120,.08)"); aura.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = aura; ctx.fillRect(0, 0, w, h);
      const sorted = stars.map((star) => { const angle = star.angle + time * star.speed; const wobble = Math.sin(angle * 3 + time * .0004) * 8; return { star, x: cx + Math.cos(angle) * (star.orbit + wobble), y: cy + Math.sin(angle) * (star.orbit * tilt) + star.lift * Math.cos(angle * 2), z: Math.sin(angle) }; }).sort((a,b)=>a.z-b.z);
      for (const point of sorted) { const alpha = .15 + (point.z + 1) * .32; ctx.fillStyle = `hsla(${point.star.hue},85%,${62 + point.z * 19}%,${alpha})`; ctx.beginPath(); ctx.arc(point.x, point.y, point.star.size * (.65 + (point.z + 1) * .45), 0, Math.PI * 2); ctx.fill(); }
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(time * .00015); ctx.strokeStyle = "rgba(236,157,244,.28)"; ctx.lineWidth = 1; for (let ring = 0; ring < 3; ring++) { ctx.beginPath(); ctx.ellipse(0, 0, 75 + ring * 58, (75 + ring * 58) * tilt, ring * .23, 0, Math.PI * 2); ctx.stroke(); } ctx.restore();
      const tapeW = Math.min(w, h) * .29, tapeH = tapeW * .59, tapeTilt = mouse.x * .14 + Math.sin(time * .00045) * .035;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(tapeTilt); ctx.shadowColor = "rgba(206,83,224,.75)"; ctx.shadowBlur = 32;
      const cassette = ctx.createLinearGradient(-tapeW / 2, -tapeH / 2, tapeW / 2, tapeH / 2); cassette.addColorStop(0, "#f2d6f4"); cassette.addColorStop(.35, "#8a3993"); cassette.addColorStop(1, "#260b2c"); ctx.fillStyle = cassette;
      ctx.beginPath(); ctx.roundRect(-tapeW / 2, -tapeH / 2, tapeW, tapeH, tapeW * .08); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255,235,255,.72)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "rgba(10,4,12,.78)"; ctx.fillRect(-tapeW * .36, -tapeH * .24, tapeW * .72, tapeH * .42);
      const reel = (x: number) => { ctx.save(); ctx.translate(x, 0); ctx.rotate(time * .0015); ctx.fillStyle = "#e8a9ef"; ctx.beginPath(); ctx.arc(0, 0, tapeH * .16, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#401247"; ctx.beginPath(); ctx.arc(0, 0, tapeH * .065, 0, Math.PI * 2); ctx.fill(); for (let n = 0; n < 5; n++) { ctx.rotate(Math.PI * 2 / 5); ctx.fillRect(-2, -tapeH * .135, 4, tapeH * .09); } ctx.restore(); };
      reel(-tapeW * .2); reel(tapeW * .2); ctx.fillStyle = "#f8ddfa"; ctx.font = `${Math.max(7, tapeW * .055)}px DM Mono`; ctx.textAlign = "center"; ctx.fillText("JOD  STUDIO  TAPE", 0, tapeH * .35); ctx.restore(); raf = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); window.addEventListener("pointermove", pointer, { passive: true }); raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", pointer); };
  }, []);
  return <div className={styles.wrap}><canvas ref={ref} className={styles.galaxy} aria-label="Interactive three dimensional particle galaxy" /><div className={styles.label}><span>JOD / ORBITAL FIELD</span><b>LIVE</b></div><p>Move your pointer through the field</p></div>;
}
