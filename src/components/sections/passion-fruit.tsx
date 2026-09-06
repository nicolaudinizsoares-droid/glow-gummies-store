// Section 04 - Passion Fruit.
//
// Restrained rather than tropical: a warm ground, the gummies at scale, and
// one line of copy. The flavour is the subject, not a fruit-stand palette.

import { Reveal } from "@/components/reveal";
import { ProductImage } from "@/components/product-image";
import { PRODUCT_ASSETS } from "@/lib/product-assets";
import { semantic } from "@/styles/tokens";

export const PassionFruit = () => (
  <section
    className="relative px-6 md:px-8 py-28 md:py-40 overflow-hidden"
    style={{
      background:
        "radial-gradient(90% 70% at 50% 40%, #FBEADB 0%, #F6D9C2 60%, #F0C9AE 100%)",
    }}
  >
    {/* Gummies drifting behind the copy. */}
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {[
        { left: "8%", top: "18%", size: 74, rot: -18, op: 0.9 },
        { left: "84%", top: "24%", size: 58, rot: 24, op: 0.75 },
        { left: "16%", top: "70%", size: 46, rot: 12, op: 0.6 },
        { left: "78%", top: "72%", size: 66, rot: -8, op: 0.8 },
      ].map((g, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: g.left,
            top: g.top,
            width: g.size,
            height: g.size,
            opacity: g.op,
            transform: `rotate(${g.rot}deg)`,
          }}
        >
          <ProductImage
            src={PRODUCT_ASSETS.gummies[i % PRODUCT_ASSETS.gummies.length]}
            variant="gummy"
            alt=""
            width={g.size * 2}
            height={g.size * 2}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>

    <Reveal className="relative max-w-2xl mx-auto text-center" stagger>
      <p data-reveal-item className="eyebrow mb-6">
        Passion Fruit
      </p>
      <h2
        data-reveal-item
        className="text-[clamp(2rem,4.5vw,3.5rem)] mb-7"
        style={{ color: semantic.text.primary }}
      >
        A little tropical indulgence.
      </h2>
      <p
        data-reveal-item
        className="text-lg md:text-xl leading-relaxed"
        style={{ color: semantic.text.secondary }}
      >
        Bright, tart and properly fruity — the reason two gummies a day stops
        feeling like a supplement and starts feeling like something you look
        forward to.
      </p>
    </Reveal>
  </section>
);
