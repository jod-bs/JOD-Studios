"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type WorkKind = "dubbing" | "music" | "sfx" | "vfx" | "edit" | "anim";

type Built = {
  root: THREE.Group;
  tick: (time: number, energy: number) => void;
};

function standard(color: number, extras: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.62,
    roughness: 0.32,
    ...extras,
  });
}

function buildDubbing(): Built {
  const root = new THREE.Group();
  const metal = standard(0xd7c4de, { metalness: 0.8, roughness: 0.22 });
  const accent = standard(0x6b2a76, { emissive: 0x4a184f, emissiveIntensity: 0.65, metalness: 0.3, roughness: 0.45 });
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.3, 20), metal);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.12, 32), metal);
  base.position.y = -1.2;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), accent);
  head.scale.y = 1.25;
  head.position.y = 1.05;
  const grille = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 16), metal);
  grille.position.y = 0.72;
  root.add(stand, base, head, grille);

  const rings: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.55 + i * 0.28, 0.015, 12, 64),
      standard(0xc984d4, { emissive: 0xa83db8, emissiveIntensity: 0.8, roughness: 0.2 })
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.y = 0.85;
    rings.push(ring);
    root.add(ring);
  }

  return {
    root,
    tick: (time, energy) => {
      rings.forEach((ring, i) => {
        const pulse = 1 + Math.sin(time * (2.2 + energy * 3) + i) * 0.08;
        ring.scale.setScalar(pulse + i * 0.02);
        const mat = ring.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.45 + Math.sin(time * 3 + i) * 0.35 + energy * 0.4;
      });
      head.rotation.z = Math.sin(time * 1.4) * 0.06;
    },
  };
}

function buildMusic(): Built {
  const root = new THREE.Group();
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(1.35, 1.35, 0.08, 64),
    standard(0x1a0a1c, { metalness: 0.45, roughness: 0.4 })
  );
  disc.rotation.x = Math.PI / 2.4;
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.1, 32),
    standard(0x6b2a76, { emissive: 0x5a245f, emissiveIntensity: 0.7 })
  );
  label.rotation.x = disc.rotation.x;
  const grooveMat = standard(0x3a203c, { metalness: 0.2, roughness: 0.65 });
  for (let i = 1; i <= 4; i++) {
    const groove = new THREE.Mesh(new THREE.TorusGeometry(0.28 + i * 0.22, 0.008, 8, 64), grooveMat);
    groove.rotation.x = disc.rotation.x;
    root.add(groove);
  }
  const faders = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), standard(0x2a142c));
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.08, 0.14),
      standard(0xe7d3ec, { emissive: 0xa83db8, emissiveIntensity: 0.25 })
    );
    col.position.x = (i - 2) * 0.28;
    cap.position.x = col.position.x;
    cap.position.y = 0.15;
    faders.add(col, cap);
    cap.userData.base = 0.15;
    cap.userData.phase = i;
  }
  faders.position.set(0, -0.15, 1.35);
  root.add(disc, label, faders);
  return {
    root,
    tick: (time, energy) => {
      disc.rotation.z -= 0.01 + energy * 0.04;
      label.rotation.z = disc.rotation.z;
      faders.children.forEach((child) => {
        if (child.userData.phase === undefined) return;
        child.position.y = child.userData.base + Math.sin(time * (1.6 + energy) + child.userData.phase) * 0.28;
      });
    },
  };
}

function buildSfx(): Built {
  const root = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.72, 1),
    standard(0x6b2a76, { emissive: 0x3a123e, emissiveIntensity: 0.9, roughness: 0.25, metalness: 0.4 })
  );
  root.add(core);
  const waves: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const wave = new THREE.Mesh(
      new THREE.TorusGeometry(0.9, 0.02, 8, 80),
      standard(0xefc8f6, { emissive: 0xc984d4, emissiveIntensity: 0.9, transparent: true, opacity: 0.85 })
    );
    wave.rotation.x = Math.PI / 2.2;
    waves.push(wave);
    root.add(wave);
  }
  const count = 80;
  const positions = new Float32Array(count * 3);
  const seeds = Array.from({ length: count }, () => ({
    a: Math.random() * Math.PI * 2,
    b: Math.random() * Math.PI,
    r: 1.1 + Math.random() * 1.3,
  }));
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0xf3d7fb, size: 0.045, transparent: true, opacity: 0.9 })
  );
  root.add(points);
  return {
    root,
    tick: (time, energy) => {
      core.rotation.y += 0.01 + energy * 0.02;
      core.rotation.x = Math.sin(time * 0.8) * 0.2;
      waves.forEach((wave, i) => {
        const cycle = ((time * (0.35 + energy * 0.25) + i / 3) % 1);
        const scale = 0.6 + cycle * 2.4;
        wave.scale.setScalar(scale);
        const mat = wave.material as THREE.MeshStandardMaterial;
        mat.opacity = 1 - cycle;
      });
      const attr = geo.getAttribute("position") as THREE.BufferAttribute;
      seeds.forEach((seed, i) => {
        const wobble = seed.r + Math.sin(time * 2 + i) * (0.12 + energy * 0.35);
        attr.setXYZ(i, Math.cos(seed.a + time * 0.6) * Math.sin(seed.b) * wobble, Math.cos(seed.b + time * 0.3) * wobble * 0.72, Math.sin(seed.a + time * 0.6) * Math.sin(seed.b) * wobble);
      });
      attr.needsUpdate = true;
    },
  };
}

function buildVfx(): Built {
  const root = new THREE.Group();
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.72, 0.18, 140, 16),
    standard(0x8a3d96, { emissive: 0x4c184f, emissiveIntensity: 0.55, metalness: 0.75, roughness: 0.18 })
  );
  root.add(knot);
  const shards = new THREE.Group();
  for (let i = 0; i < 10; i++) {
    const shard = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.12 + (i % 3) * 0.04, 0),
      standard(0xf0d4f6, { emissive: 0xa83db8, emissiveIntensity: 0.4 })
    );
    shard.userData.angle = (i / 10) * Math.PI * 2;
    shard.userData.radius = 1.45 + (i % 4) * 0.12;
    shard.userData.y = ((i % 5) - 2) * 0.22;
    shards.add(shard);
  }
  root.add(shards);
  return {
    root,
    tick: (time, energy) => {
      knot.rotation.x += 0.008 + energy * 0.01;
      knot.rotation.y -= 0.012 + energy * 0.02;
      shards.children.forEach((shard) => {
        const angle = shard.userData.angle + time * (0.7 + energy);
        const radius = shard.userData.radius;
        shard.position.set(Math.cos(angle) * radius, shard.userData.y + Math.sin(time * 2 + angle) * 0.12, Math.sin(angle) * radius);
        shard.rotation.x += 0.03;
        shard.rotation.y += 0.02;
      });
    },
  };
}

function buildEdit(): Built {
  const root = new THREE.Group();
  const metal = standard(0xcbb8d2, { metalness: 0.85, roughness: 0.2 });
  const dark = standard(0x241028, { metalness: 0.4, roughness: 0.5 });
  const makeReel = (x: number) => {
    const reel = new THREE.Group();
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 24), metal);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.06, 12, 40), dark);
    hub.rotation.x = Math.PI / 2;
    ring.rotation.y = Math.PI / 2;
    reel.add(hub, ring);
    for (let i = 0; i < 6; i++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.04), metal);
      spoke.position.y = 0.28;
      spoke.rotation.z = (i / 6) * Math.PI * 2;
      const wrapper = new THREE.Group();
      wrapper.rotation.z = (i / 6) * Math.PI * 2;
      wrapper.add(spoke);
      spoke.position.set(0, 0.42, 0);
      reel.add(wrapper);
    }
    reel.position.x = x;
    return reel;
  };
  const left = makeReel(-1.15);
  const right = makeReel(1.15);
  const film = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 0.28, 0.04),
    standard(0x6b2a76, { emissive: 0x3d163f, emissiveIntensity: 0.4 })
  );
  const playhead = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.7, 0.08),
    standard(0xf6e7fb, { emissive: 0xd7a0e4, emissiveIntensity: 0.5 })
  );
  root.add(left, right, film, playhead);
  return {
    root,
    tick: (time, energy) => {
      const spin = 0.02 + energy * 0.05;
      left.rotation.x += spin;
      right.rotation.x -= spin * 0.85;
      playhead.position.x = Math.sin(time * (1.1 + energy)) * 0.95;
      playhead.position.y = 0.15;
    },
  };
}

function buildAnim(): Built {
  const root = new THREE.Group();
  const bodyMat = standard(0x7a347f, { emissive: 0x401646, emissiveIntensity: 0.35, roughness: 0.4 });
  const limbMat = standard(0xe6d0ea, { metalness: 0.35, roughness: 0.4 });
  const figure = new THREE.Group();
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.4), bodyMat);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 18), limbMat);
  head.position.y = 0.78;
  const makeLimb = (x: number, y: number, h: number) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, 0);
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, h, 6, 12), limbMat);
    mesh.position.y = -h / 2;
    pivot.add(mesh);
    return pivot;
  };
  const armL = makeLimb(-0.48, 0.28, 0.7);
  const armR = makeLimb(0.48, 0.28, 0.7);
  const legL = makeLimb(-0.18, -0.48, 0.75);
  const legR = makeLimb(0.18, -0.48, 0.75);
  const spark = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.14, 0),
    standard(0xf3d9fa, { emissive: 0xc45ad0, emissiveIntensity: 0.8 })
  );
  figure.add(torso, head, armL, armR, legL, legR);
  root.add(figure, spark);
  return {
    root,
    tick: (time, energy) => {
      const pace = time * (3 + energy * 4);
      figure.position.y = Math.abs(Math.sin(pace)) * 0.18;
      armL.rotation.x = Math.sin(pace) * 0.7;
      armR.rotation.x = Math.sin(pace + Math.PI) * 0.7;
      legL.rotation.x = Math.sin(pace + Math.PI) * 0.6;
      legR.rotation.x = Math.sin(pace) * 0.6;
      torso.rotation.y = Math.sin(time) * 0.12;
      spark.position.set(Math.cos(time * 1.6) * 1.3, Math.sin(time * 2.3) * 0.7 + 0.4, Math.sin(time * 1.6) * 1.3);
      spark.rotation.y += 0.05;
    },
  };
}

const BUILDERS: Record<WorkKind, () => Built> = {
  dubbing: buildDubbing,
  music: buildMusic,
  sfx: buildSfx,
  vfx: buildVfx,
  edit: buildEdit,
  anim: buildAnim,
};

export default function WorkObject({ kind, playing }: { kind: WorkKind; playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0.15, 6.4);

    scene.add(new THREE.AmbientLight(0xfff4ff, 0.7));
    const key = new THREE.DirectionalLight(0xffe9ff, 2.2);
    key.position.set(3, 4, 5);
    const rim = new THREE.PointLight(0xa83db8, 16, 18);
    rim.position.set(-3, 1, -2);
    scene.add(key, rim);

    const tilt = new THREE.Group();
    const { root, tick } = BUILDERS[kind]();
    tilt.add(root);
    scene.add(tilt);

    const target = { x: 0.15, y: 0.35 };
    const hover = { x: 0, y: 0 };
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let energy = 0;

    const resize = () => {
      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };
    const onUp = () => {
      dragging = false;
    };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      hover.x = (event.clientX - rect.left) / rect.width - 0.5;
      hover.y = (event.clientY - rect.top) / rect.height - 0.5;
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      target.y += dx * 0.012;
      target.x += dy * 0.01;
      target.x = Math.max(-0.8, Math.min(0.9, target.x));
      energy = Math.min(1, energy + Math.hypot(dx, dy) * 0.02);
      lastX = event.clientX;
      lastY = event.clientY;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointermove", onMove);
    window.addEventListener("resize", resize);
    resize();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const started = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!playingRef.current) return;
      const time = reduce ? 0 : (now - started) / 1000;
      energy += (0 - energy) * 0.02;
      const sway = reduce ? 0 : Math.sin(time * 0.45) * 0.18;
      tilt.rotation.y += (target.y + hover.x * 0.45 + sway - tilt.rotation.y) * 0.08;
      tilt.rotation.x += (target.x - hover.y * 0.3 - tilt.rotation.x) * 0.08;
      if (!reduce) tick(time, energy);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });
      renderer.dispose();
    };
  }, [kind]);

  return <canvas ref={canvasRef} className="work-object-canvas" aria-label="Interactive 3D studio object. Drag to play with it." />;
}
