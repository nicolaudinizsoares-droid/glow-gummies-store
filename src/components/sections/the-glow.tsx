// Section 02 - The Glow.

import { Reveal } from "@/components/reveal";
import { semantic } from "@/styles/tokens";

export const TheGlow = () => (
  <section id="the-glow" className="px-6 md:px-8 py-24 md:py-36">
    <Reveal className="max-w-3xl mx-auto text-center" stagger>
      <p data-reveal-item className="eyebrow mb-6">
        The Glow
      </p>
      <h2
        data-reveal-item
        className="text-[clamp(2rem,4.5vw,3.5rem)] mb-8"
        style={{ color: semantic.text.primary }}
      >
        Your beauty ritual, reimagined.
      </h2>
      <p
        data-reveal-item
        className="text-lg md:text-xl leading-relaxed"
        style={{ color: semantic.text.secondary }}
      >
        Most of a beauty routine happens on the surface. Glow works the other
        way round — a daily supplement for your hair, skin and nails that
        happens to taste like passion fruit.
      </p>
      <p
        data-reveal-item
        className="text-lg md:text-xl leading-relaxed mt-5"
        style={{ color: semantic.text.secondary }}
      >
        No extra step to remember. Just two gummies, and the rest of your day.
      </p>
    </Reveal>
  </section>
);
