// The bottle, modelled.
//
// A turntable that does not need frames. `bottle-spin.tsx` is still the better
// answer once the 36 photographs in public/products/spin/ exist -- a real
// bottle has nothing to approximate -- but until that shoot happens this gives
// the hero a product that turns instead of a product that sits.
//
// Three rules it inherits from the rest of the site:
//
//   * three.js is imported dynamically, so ~600 KB stays out of the initial
//     bundle and a visitor who prefers reduced motion never downloads it at
//     all -- the same bargain use-gsap.ts makes.
//   * Nothing here is required for the hero to be complete. The photograph
//     underneath is the real first paint; this fades in over it, or never
//     arrives, and the page reads the same either way.
//   * The label is drawn, not fetched. One canvas, no extra request, and the
//     net weight comes from the product data like every other figure onsite.

"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/motion/use-gsap";

interface Bottle3DProps {
  /** Net weight and gummy count, as printed on the label. */
  netWeight: string;
  gummyCount: number;
  /** Fires once the scene has rendered its first frame. */
  onReady?: () => void;
  className?: string;
}

/**
 * next/font generates hashed family names, so the literal "Pacifico" will not
 * resolve in a canvas font shorthand. Read what the CSS variable actually
 * resolved to instead.
 */
function resolveFont(variable: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;font-family:var(${variable})`;
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily || fallback;
  probe.remove();
  return family;
}

function drawLabel(netWeight: string, gummyCount: number): HTMLCanvasElement {
  const script = resolveFont("--font-pacifico", "cursive");
  const sans = resolveFont("--font-inter", "sans-serif");

  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const x = c.getContext("2d");
  if (!x) return c;

  x.fillStyle = "#F7E8D5"; // primitive.cream[200] -- the label stock
  x.fillRect(0, 0, 1024, 512);

  // Only about a third of a cylinder's circumference faces the camera, so the
  // lockup has to fit inside a ~330px window of the 1024px wrap. Drawn wider
  // than this it clips at the silhouette instead of curving away.
  const cx = 512;
  const W = 165;

  x.strokeStyle = "#C8A063"; // the printed gold rule
  x.lineWidth = 3;
  x.strokeRect(cx - W, 58, W * 2, 396);
  x.lineWidth = 1.2;
  x.strokeRect(cx - W + 9, 67, W * 2 - 18, 378);

  x.textAlign = "center";
  x.fillStyle = "#14213A";
  x.font = `62px ${script}`;
  x.fillText("Glow", cx - 6, 160);
  x.font = `600 17px ${sans}`;
  x.fillText("+", cx + 72, 126);
  x.font = `700 41px ${sans}`;
  x.fillText("HAIR, SKIN", cx, 232);
  x.fillText("& NAILS", cx, 276);
  x.font = `500 23px ${sans}`;
  x.fillText("GUMMIES", cx, 316);
  x.fillText("PASSION FRUIT", cx, 346);
  x.fillText("FLAVOR", cx, 376);
  x.font = `500 14px ${sans}`;
  x.fillStyle = "#3D4A63";
  x.fillText(`NET WT. ${netWeight}  |  ${gummyCount} GUMMIES`, cx, 424);

  // Side panels: the suggestion of a facts table. Never legible at this size,
  // and deliberately not real text -- an unreadable dosage is worse than none.
  x.fillStyle = "rgba(20,33,58,.26)";
  for (let i = 0; i < 20; i++) {
    x.fillRect(120, 92 + i * 17, 120 + ((i * 53) % 90), 4);
    x.fillRect(792, 92 + i * 17, 112 + ((i * 37) % 90), 4);
  }
  return c;
}

export const Bottle3D = ({
  netWeight,
  gummyCount,
  onReady,
  className = "",
}: Bottle3DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [near, setNear] = useState(false);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  // Only load the library once the hero is actually near the viewport.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // A visitor who asked for reduced motion gets the photograph and no
    // download. There is no still frame worth 600 KB.
    if (reduced || !near) return;

    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    let disposed = false;
    let raf = 0;
    let cleanup: (() => void) | undefined;

    import("three")
      .then((THREE) => {
        if (disposed) return;

        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        } catch {
          return; // no WebGL; the photograph stays
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
        const group = new THREE.Group();
        scene.add(group);

        // Bottle profile, lathed. Units are centimetres; it stands ~9 cm.
        const p = (x: number, y: number) => new THREE.Vector2(x, y);
        const glass = new THREE.Mesh(
          new THREE.LatheGeometry(
            [
              p(0, 0), p(2.05, 0), p(2.15, 0.22), p(2.15, 6.6), p(2.05, 7.35),
              p(1.55, 8.05), p(1.28, 8.45), p(1.26, 9.1), p(1.2, 9.16), p(0, 9.16),
            ],
            72,
          ),
          new THREE.MeshPhysicalMaterial({
            color: 0xf3eee6,
            metalness: 0,
            roughness: 0.09,
            clearcoat: 1,
            clearcoatRoughness: 0.05,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        );
        group.add(glass);

        const tex = new THREE.CanvasTexture(drawLabel(netWeight, gummyCount));
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const label = new THREE.Mesh(
          new THREE.CylinderGeometry(2.17, 2.17, 4.35, 72, 1, true),
          new THREE.MeshStandardMaterial({
            map: tex,
            roughness: 0.78,
            metalness: 0,
            color: 0xf9f0e2,
          }),
        );
        label.position.y = 3.55;
        // CylinderGeometry puts texture u=0 at +Z, which faces the camera. The
        // lockup is drawn at u=0.5, so without this it starts facing away.
        label.rotation.y = Math.PI;
        group.add(label);

        const capMat = new THREE.MeshStandardMaterial({
          color: 0xfafaf8,
          roughness: 0.42,
          metalness: 0,
        });
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.42, 1.3, 64), capMat);
        cap.position.y = 9.62;
        group.add(cap);
        const capTop = new THREE.Mesh(
          new THREE.CylinderGeometry(1.34, 1.42, 0.16, 64),
          capMat,
        );
        capTop.position.y = 10.32;
        group.add(capTop);

        const ribGeo = new THREE.BoxGeometry(0.055, 1.18, 0.1);
        const ribMat = new THREE.MeshStandardMaterial({ color: 0xedede9, roughness: 0.5 });
        for (let r = 0; r < 40; r++) {
          const a = (r / 40) * Math.PI * 2;
          const rib = new THREE.Mesh(ribGeo, ribMat);
          rib.position.set(Math.cos(a) * 1.43, 9.62, Math.sin(a) * 1.43);
          rib.rotation.y = -a;
          group.add(rib);
        }

        const gumGeo = new THREE.SphereGeometry(0.52, 18, 14);
        const gumMat = new THREE.MeshPhysicalMaterial({
          color: 0xb81b2a,
          roughness: 0.28,
          metalness: 0,
          clearcoat: 0.8,
          transparent: true,
          opacity: 0.96,
        });
        // Fixed seed: the fill is arbitrary but must not reshuffle on re-render.
        let seed = 7;
        const rnd = () => {
          seed = (seed * 16807) % 2147483647;
          return seed / 2147483647;
        };
        for (let g = 0; g < 34; g++) {
          const m = new THREE.Mesh(gumGeo, gumMat);
          const rad = Math.sqrt(rnd()) * 1.44;
          const ang = rnd() * Math.PI * 2;
          m.position.set(Math.cos(ang) * rad, 0.5 + rnd() * 5.6, Math.sin(ang) * rad);
          m.scale.set(1, 0.62, 1);
          m.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
          group.add(m);
        }

        const sc = document.createElement("canvas");
        sc.width = sc.height = 256;
        const sx = sc.getContext("2d")!;
        const grd = sx.createRadialGradient(128, 128, 4, 128, 128, 124);
        grd.addColorStop(0, "rgba(74,56,36,.62)");
        grd.addColorStop(0.5, "rgba(74,56,36,.22)");
        grd.addColorStop(1, "rgba(74,56,36,0)");
        sx.fillStyle = grd;
        sx.fillRect(0, 0, 256, 256);
        const shadowTex = new THREE.CanvasTexture(sc);
        const shadow = new THREE.Mesh(
          new THREE.PlaneGeometry(11, 11),
          new THREE.MeshBasicMaterial({
            map: shadowTex,
            transparent: true,
            depthWrite: false,
          }),
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.02;
        scene.add(shadow);

        // Lit to match the photography: warm key upper-left, cool fill, warm rim.
        scene.add(new THREE.AmbientLight(0xfff6ea, 0.78));
        const key = new THREE.DirectionalLight(0xfff4e4, 1.02);
        key.position.set(-6, 11, 7);
        const fill = new THREE.DirectionalLight(0xdce6f2, 0.44);
        fill.position.set(7, 4, 5);
        const rim = new THREE.DirectionalLight(0xffe6c4, 0.72);
        rim.position.set(2, 6, -8);
        scene.add(key, fill, rim);

        // The hero panel is a different shape on every breakpoint -- wide and
        // short beside the copy, tall and narrow above it on a phone. Solve the
        // camera distance from the panel's actual aspect rather than guessing
        // per breakpoint, or the cap crops off the top of the taller frames.
        const BOTTLE_H = 11.0; // base to cap top, plus the float
        const BOTTLE_MID = 5.3;
        const BOTTLE_W = 5.2;
        const layout = () => {
          const w = host.clientWidth;
          const h = host.clientHeight;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          const aspect = w / h;
          camera.aspect = aspect;
          camera.fov = 30;
          const vHalf = (camera.fov / 2) * (Math.PI / 180);
          const hHalf = Math.atan(Math.tan(vHalf) * aspect);
          const dist = Math.max(
            BOTTLE_H / 2 / Math.tan(vHalf),
            BOTTLE_W / 2 / Math.tan(hHalf),
          );
          camera.position.set(0, BOTTLE_MID + 1.7, dist * 1.34);
          camera.lookAt(0, BOTTLE_MID, 0);
          camera.updateProjectionMatrix();
        };
        layout();
        const ro = new ResizeObserver(layout);
        ro.observe(host);

        // Drag to turn; release hands the momentum back to the idle spin.
        let spin = 0;
        let vel = 0;
        let dragging = false;
        let lastX = 0;
        let userVel = 0;
        const onDown = (e: PointerEvent) => {
          dragging = true;
          lastX = e.clientX;
          userVel = 0;
        };
        const onMove = (e: PointerEvent) => {
          if (!dragging) return;
          const d = (e.clientX - lastX) * 0.008;
          lastX = e.clientX;
          spin += d;
          userVel = d;
        };
        const onUp = () => {
          if (!dragging) return;
          dragging = false;
          vel = userVel * 8;
        };
        host.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);

        let onScreen = true;
        const vis = new IntersectionObserver((en) => {
          onScreen = en[0]?.isIntersecting ?? true;
        });
        vis.observe(host);

        const clock = new THREE.Clock();
        let announced = false;
        const frame = () => {
          raf = requestAnimationFrame(frame);
          if (!onScreen || document.hidden) {
            clock.getDelta();
            return;
          }
          const dt = Math.min(clock.getDelta(), 0.05);
          if (!dragging) {
            spin += (0.32 + vel) * dt;
            vel *= Math.pow(0.02, dt);
          }
          group.rotation.y = spin;
          // Float and tilt on non-harmonic periods, so the pair never visibly
          // resynchronises into a loop.
          const t = clock.getElapsedTime();
          group.position.y = Math.sin(t * 0.51) * 0.3;
          group.rotation.z = Math.sin(t * 0.37) * 0.018;
          shadow.material.opacity = 0.82 + Math.sin(t * 0.51) * 0.12;
          renderer.render(scene, camera);
          if (!announced) {
            announced = true;
            readyRef.current?.();
          }
        };
        frame();

        cleanup = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          vis.disconnect();
          host.removeEventListener("pointerdown", onDown);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          scene.traverse((o) => {
            const mesh = o as InstanceType<typeof THREE.Mesh>;
            if (mesh.geometry) mesh.geometry.dispose();
            const mat = mesh.material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else if (mat) mat.dispose();
          });
          tex.dispose();
          shadowTex.dispose();
          renderer.dispose();
        };
      })
      .catch(() => {
        /* library failed to load; the photograph stays */
      });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reduced, near, netWeight, gummyCount]);

  return (
    <div ref={hostRef} className={`absolute inset-0 ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full touch-pan-y" />
    </div>
  );
};
