// Turntable viewer.
//
// Plays a 360 degree photographic spin: one frame per rotation step, swapped as
// the visitor scrolls, or dragged directly with a pointer. Frames come from
// public/products/spin/ via a manifest built at compile time, because a browser
// cannot list a directory.
//
// The frames are real photographs of the real bottle, which is why this beats
// both a layered still and a modelled 3D bottle -- there is nothing to
// approximate.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import manifest from "@/data/spin-frames.json";
import { usePrefersReducedMotion } from "@/lib/motion/use-gsap";
import { semantic } from "@/styles/tokens";

const FRAMES: string[] = manifest.frames;
export const hasSpinFrames = FRAMES.length > 0;

interface BottleSpinProps {
  alt: string;
  className?: string;
  /** 0-1. Drives the frame when the viewer is scroll-linked. */
  progress?: number;
  /** Let the visitor drag to rotate. */
  draggable?: boolean;
  priority?: boolean;
}

export const BottleSpin = ({
  alt,
  className = "",
  progress,
  draggable = true,
  priority = false,
}: BottleSpinProps) => {
  const [frame, setFrame] = useState(0);
  const [ready, setReady] = useState(false);
  const [dragged, setDragged] = useState(false);
  const dragOffset = useRef(0);
  const pointerStart = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Decode every frame up front. A spin that stutters on first rotation looks
  // broken, and the whole sequence is smaller than one hero photograph.
  useEffect(() => {
    if (!hasSpinFrames) return;
    let cancelled = false;
    let loaded = 0;
    for (const src of FRAMES) {
      const img = new Image();
      img.src = src;
      img.decoding = "async";
      const done = () => {
        if (cancelled) return;
        loaded += 1;
        if (loaded === FRAMES.length) setReady(true);
      };
      img.onload = done;
      img.onerror = done;
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll-linked frame, unless the visitor has taken over by dragging.
  useEffect(() => {
    if (dragged || progress === undefined || !hasSpinFrames) return;
    const wrapped = ((progress % 1) + 1) % 1;
    setFrame(Math.round(wrapped * (FRAMES.length - 1)));
  }, [progress, dragged]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!draggable || !hasSpinFrames) return;
      pointerStart.current = e.clientX;
      dragOffset.current = frame;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [draggable, frame]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (pointerStart.current === null) return;
      const width = containerRef.current?.clientWidth ?? 300;
      // One full drag across the element is one full rotation.
      const delta = ((e.clientX - pointerStart.current) / width) * FRAMES.length;
      const next = Math.round(dragOffset.current - delta);
      setFrame(((next % FRAMES.length) + FRAMES.length) % FRAMES.length);
      setDragged(true);
    },
    []
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    pointerStart.current = null;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }, []);

  if (!hasSpinFrames) return null;

  // Reduced motion: a single still, no rotation, no drag affordance.
  const shown = reduced ? Math.floor(FRAMES.length / 2) : frame;

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${draggable && !reduced ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
      onPointerDown={reduced ? undefined : onPointerDown}
      onPointerMove={reduced ? undefined : onPointerMove}
      onPointerUp={reduced ? undefined : onPointerUp}
      onPointerCancel={reduced ? undefined : onPointerUp}
      style={{ touchAction: "pan-y" }}
    >
      {/* Only the active frame is in the DOM; the rest are decoded in cache. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-spin-frame={shown}
        src={FRAMES[shown]}
        alt={alt}
        draggable={false}
        fetchPriority={priority ? "high" : "auto"}
        className="w-full h-auto object-contain pointer-events-none"
      />

      {draggable && !reduced && ready && !dragged && (
        <p
          className="absolute bottom-1 inset-x-0 flex items-center justify-center gap-1.5 text-xs pointer-events-none"
          style={{ color: semantic.text.muted }}
        >
          <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
          Drag to spin
        </p>
      )}
    </div>
  );
};
