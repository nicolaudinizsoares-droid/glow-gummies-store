// Section 05 - Benefits.
//
// Copy deliberately describes the ritual rather than promising outcomes.
// Structure/function claims on a supplement carry the FDA disclaimer, and
// anything stronger would be a claim Glow cannot substantiate.

import { Reveal } from "@/components/reveal";
import { GlowSparkle } from "@/components/glow-logo";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { semantic, primitive } from "@/styles/tokens";

const BENEFITS = [
  {
    label: "Hair",
    copy: "Designed to complement your daily beauty routine.",
    tint: primitive.blush[400],
  },
  {
    label: "Skin",
    copy: "A simple addition to your everyday wellness ritual.",
    tint: primitive.apricot[500],
  },
  {
    label: "Nails",
    copy: "An easy, enjoyable part of your daily routine.",
    tint: primitive.gold[500],
  },
];

export const Benefits = () => (
  <section id="benefits" className="px-6 md:px-8 py-24 md:py-32">
    <div className="max-w-5xl mx-auto">
      <Reveal className="text-center mb-16" stagger>
        <p data-reveal-item className="eyebrow mb-6">
          Benefits
        </p>
        <h2
          data-reveal-item
          className="text-[clamp(2rem,4vw,3.25rem)]"
          style={{ color: semantic.text.primary }}
        >
          Two gummies a day
        </h2>
      </Reveal>

      <Reveal className="grid sm:grid-cols-3 gap-10 md:gap-14" stagger distance={32}>
        {BENEFITS.map((benefit) => (
          <div key={benefit.label} data-reveal-item className="text-center">
            <div
              className="w-14 h-14 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: benefit.tint + "2E" }}
            >
              <GlowSparkle className="w-5 h-5" color={benefit.tint} />
            </div>
            <h3
              className="text-xl mb-3"
              style={{ color: semantic.text.primary }}
            >
              {benefit.label}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: semantic.text.secondary }}
            >
              {benefit.copy}
            </p>
          </div>
        ))}
      </Reveal>

      <div className="mt-16">
        <LegalDisclaimer bordered={false} />
      </div>
    </div>
  </section>
);
