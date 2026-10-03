"use client";

import { ElementsBackground as ElementsCollection } from "../src/shaders/elements/ElementsBackground";
import "../src/shaders/threeui.css";

export function ServicesField() {
  return (
    <div className="shader-frame">
      <ElementsCollection
        variant="water"
        // speed={1.0}
        // size={1.0}
        // particleAmount={1.0}
        speed={1.0}
        size={0.50}
        particleAmount={1.0}
        hue={60}
        saturation={1.0}
        brightness={1.0}
        opacity={1.0} 
      />
    </div>
  );
}
