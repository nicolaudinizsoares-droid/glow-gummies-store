// Hero: the bottle-opening sequence.
//
// Structure is a tall scroll track with a pinned stage inside it. Scrolling
// scrubs a GSAP timeline rather than playing it on a clock, so the visitor
// controls the reveal:
//
//   0.00  bottle closed, centred
//   0.20  camera pushes in
//   0.40  cap begins to twist
//   0.60  cap clears the bottle
//   0.70  gummies rise
//   1.00  final composition, copy and CTAs
//
// Reduced motion, or a device that cannot carry it, gets the final composition
// immediately as plain markup. That is why the static state below is authored
// as the *finished* frame, never as the "before" -- if the timeline never runs,
// what is already on screen is correct.

"use client";

import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { PRODUCT_ASSETS } from "@/lib/product-assets";
import { useGsapEffect } from "@/lib/motion/use-gsap";
import { semantic, motion as motionTokens } from "@/styles/tokens";

export const Hero = () => {
  const scopeRef = useGsapEffect((gsap, scope) => {
    const stage = scope.querySelector<HTMLElement>("[data-stage]");
    const cap = scope.querySelector<HTMLElement>("[data-cap]");
    const body = scope.querySelector<HTMLElement>("[data-bottle]");
    const gummies = gsap.utils.toArray<HTMLElement>("[data-gummy]", scope);
    const copy = gsap.utils.toArray<HTMLElement>("[data-copy]", scope);
    if (!stage || !cap || !body) return;

    const timeline = gsap.timeline({
      defaults: { ease: motionTokens.ease.cinematic },
      scrollTrigger: {
        trigger: scope,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pin: stage,
        pinSpacing: false,
        anticipatePin: 1,
      },
    });

    // Every tween is a fromTo landing on 0, because the resting frame is owned
    // by CSS on the wrapper elements. Overlapping from() tweens on one property
    // do not work here: from() renders immediately, so a second from() on the
    // same property captures the first one's start as its destination and the
    // element never reaches its real resting position.
    timeline
      // Camera push-in.
      .fromTo(
        [body, cap],
        { scale: 0.92, yPercent: 4 },
        { scale: 1, yPercent: 0, duration: 2 },
        0
      )
      // Cap twists free and lifts clear.
      .fromTo(
        cap,
        { y: 62, rotate: 12 },
        { y: 0, rotate: 0, duration: 3 },
        2
      )
      // Gummies rise out of the open bottle on staggered paths.
      .fromTo(
        gummies,
        { y: 140, opacity: 0, scale: 0.6, rotate: -25 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 3,
          stagger: motionTokens.stagger.loose,
        },
        3.5
      )
      // Copy resolves last, once the product has had the stage to itself.
      .fromTo(
        copy,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 2, stagger: motionTokens.stagger.base },
        5
      );
  });

  return (
    <section
      ref={scopeRef as React.RefObject<HTMLDivElement>}
      className="relative h-[300vh]"
      aria-label="Glow Gummies"
    >
      <div
        data-stage
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 15%, #FFF6E6 0%, #FBE4CE 45%, #F6D3B8 100%)",
        }}
      >
        {/* Product stage: upper area, clear of the copy block below. */}
        <div className="absolute inset-x-0 top-0 h-[62%] md:h-[66%] flex items-end justify-center pb-2">
          {/* Gummies rising. Behind the bottle so they read as coming from it. */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { left: "41%", top: "30%", size: 40, rotate: -14 },
              { left: "56%", top: "22%", size: 32, rotate: 22 },
              { left: "49%", top: "12%", size: 26, rotate: -6 },
            ].map((g, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: g.left,
                  top: g.top,
                  width: g.size,
                  height: g.size,
                  transform: `rotate(${g.rotate}deg)`,
                }}
              >
                <div data-gummy className="w-full h-full">
                  <ProductImage
                    src={PRODUCT_ASSETS.gummies[i]}
                    variant="gummy"
                    alt=""
                    width={g.size * 2}
                    height={g.size * 2}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottle, with the cap anchored to its own neck so the two stay
              related at any viewport width. */}
          <div className="relative" style={{ width: "clamp(150px, 19vw, 250px)" }}>
            {/* Cap: resting position is lifted clear and tilted. */}
            <div
              className="absolute left-1/2 z-10"
              style={{
                width: "46%",
                top: "-18%",
                transform: "translateX(-50%) translateY(-14%) rotate(-12deg)",
              }}
            >
              <div data-cap>
                <ProductImage
                  src={PRODUCT_ASSETS.cap}
                  variant="cap"
                  alt=""
                  width={240}
                  height={160}
                  className="w-full h-auto object-contain drop-shadow-[0_8px_14px_rgba(10,29,54,0.16)]"
                />
              </div>
            </div>

            <div data-bottle>
              <ProductImage
                src={PRODUCT_ASSETS.bottleBody}
                alt="Glow Hair, Skin & Nails gummies"
                width={680}
                height={900}
                priority
                className="w-full h-auto object-contain drop-shadow-[0_30px_40px_rgba(10,29,54,0.18)]"
              />
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="absolute inset-x-0 bottom-0 h-[38%] md:h-[34%] flex flex-col justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              data-copy
              className="text-[clamp(2.75rem,7vw,6rem)] leading-[1.02] mb-4"
              style={{ color: semantic.text.primary }}
            >
              Glow from within.
            </h1>
            <p
              data-copy
              className="text-base md:text-lg mb-8"
              style={{ color: semantic.text.secondary }}
            >
              Your daily beauty ritual, made delicious.
            </p>
            <div
              data-copy
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link
                href="/products/hair-skin-nails-gummies-passion-fruit"
                className="w-full sm:w-auto px-8 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: semantic.text.primary,
                  color: semantic.text.inverse,
                }}
              >
                Shop Glow Gummies
              </Link>
              <Link
                href="#the-glow"
                className="w-full sm:w-auto px-8 py-4 text-[0.75rem] tracking-[0.18em] uppercase font-semibold border transition-colors"
                style={{
                  borderColor: semantic.text.primary,
                  color: semantic.text.primary,
                }}
              >
                Discover More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
