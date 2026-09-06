// Scroll-triggered reveal.
//
// The wrapper renders its children in their finished state. GSAP then plays
// them *from* an offset once they enter the viewport. Doing it this way round
// means content is never gated behind an animation that might not run --
// reduced motion, a failed chunk load, or a crawler all see real content.

"use client";

import { useGsapEffect } from "@/lib/motion/use-gsap";
import { motion as motionTokens } from "@/styles/tokens";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger children matching [data-reveal-item] instead of the wrapper. */
  stagger?: boolean;
  /** Vertical travel in px. */
  distance?: number;
  as?: "div" | "section";
}

export const Reveal = ({
  children,
  className = "",
  stagger = false,
  distance = 28,
  as: Tag = "div",
}: RevealProps) => {
  const ref = useGsapEffect((gsap, scope) => {
    const targets = stagger
      ? gsap.utils.toArray<HTMLElement>("[data-reveal-item]", scope)
      : [scope];
    if (targets.length === 0) return;

    gsap.fromTo(
      targets,
      { y: distance, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: motionTokens.duration.slow,
        ease: motionTokens.ease.entrance,
        stagger: stagger ? motionTokens.stagger.base : 0,
        scrollTrigger: {
          trigger: scope,
          start: "top 85%",
          once: true,
        },
      }
    );
  });

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement & HTMLElement>}
      className={className}
    >
      {children}
    </Tag>
  );
};
