"use client";

import type { ReactNode } from "react";

export default function Marquee({
  children,
  reverse = false,
  duration = 42,
  className = "",
}: {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`ag-marquee ${className}`} style={{ ["--ag-duration" as string]: `${duration}s` }}>
      <div className={`ag-marquee-track${reverse ? " is-reverse" : ""}`}>
        <div className="ag-marquee-group">{children}</div>
        <div className="ag-marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
