// Section 07 - The Ritual.

import { Reveal } from "@/components/reveal";
import { semantic } from "@/styles/tokens";

const STEPS = [
  { n: "01", label: "Open", copy: "Twist the cap. Two gummies, once a day." },
  { n: "02", label: "Enjoy", copy: "Chew properly. Passion fruit, not a chalky tablet." },
  { n: "03", label: "Glow", copy: "Put the bottle back where you will see it tomorrow." },
];

export const TheRitual = () => (
  <section id="the-ritual" className="px-6 md:px-8 py-24 md:py-32">
    <div className="max-w-5xl mx-auto">
      <Reveal className="text-center mb-16" stagger>
        <p data-reveal-item className="eyebrow mb-6">
          The Ritual
        </p>
        <h2
          data-reveal-item
          className="text-[clamp(2rem,4vw,3.25rem)]"
          style={{ color: semantic.text.primary }}
        >
          Three seconds, every morning.
        </h2>
      </Reveal>

      <Reveal className="grid md:grid-cols-3 gap-px" stagger distance={32}>
        {STEPS.map((step) => (
          <div
            key={step.n}
            data-reveal-item
            className="p-8 md:p-10"
            style={{
              backgroundColor: semantic.surface.raised,
              border: `1px solid ${semantic.border.subtle}`,
            }}
          >
            <p
              className="font-[family-name:var(--font-playfair)] text-5xl mb-5"
              style={{ color: semantic.accent.metallic }}
            >
              {step.n}
            </p>
            <h3
              className="text-lg uppercase tracking-[0.14em] mb-3"
              style={{ color: semantic.text.primary }}
            >
              {step.label}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: semantic.text.secondary }}>
              {step.copy}
            </p>
          </div>
        ))}
      </Reveal>
    </div>
  </section>
);
