"use client";
import { useState } from "react";
import styles from "./BeforeAfter.module.css";

export default function BeforeAfter({ label, image }: { label: string; image: string }) {
  const [position, setPosition] = useState(50);
  return <div className="compare-card"><div className="eyebrow">{label}</div><div className={styles.frame} style={{ backgroundImage: `url('${image}')` }} role="img" aria-label={`Interactive before and after ${label}`}><div className={styles.before} style={{ width: `${position}%` }}><span className={styles.tag}>Before</span></div><div className={styles.after}><span className={styles.tag}>After</span></div><div className={styles.divider} style={{ left: `${position}%` }} aria-hidden="true">↔</div><input className={styles.range} aria-label={`Adjust ${label} comparison`} type="range" min="0" max="100" value={position} onChange={e => setPosition(+e.target.value)} /></div></div>;
}
