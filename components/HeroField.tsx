"use client";

import { ConstellationField } from "../src/shaders/constellation-field/ConstellationField";
import "../src/shaders/threeui.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <ConstellationField
        variant="gateway-flow"
        mode="dark"
        speed={1.0}
        size={1.01} 
        length={1.0}
        density={1.0}
        opacity={0.72}
        hue={268}
        saturation={2.0}
        brightness={1.0}
        style={{ filter: "sepia(1) saturate(5) hue-rotate(245deg) brightness(0.95)" }}
      />
    </div>
  );
}
