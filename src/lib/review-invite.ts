// Review invitation and its incentive.
//
// Offering something for a review is allowed. Two conditions make the
// difference between a legitimate incentive and an actionable one, and both
// are encoded here rather than left to whoever writes the copy:
//
//   1. The reward cannot depend on the review being positive. A one-star
//      review earns the same code as a five-star one. `qualifyingRatings`
//      exists to make that explicit and to stop anyone narrowing it later.
//   2. The incentive has to be disclosed wherever the review appears. Reviews
//      collected this way carry `incentivized: true`, and the review card
//      renders a label from it. The disclosure is not optional copy -- it is
//      a property of the data.
//
// Both come from the FTC rule on consumer reviews and testimonials. The UK
// DMCC Act and the EU Omnibus Directive say substantially the same thing, so
// this holds for the markets the store ships to.

/**
 * Where a submitted review is sent.
 *
 * Nothing is connected, for the same reason checkout has no processor: a form
 * that appears to submit and then drops the response is worse than a form that
 * says it cannot take one yet. Point `endpoint` at a handler (a route in this
 * app, a form service, a reviews provider) and set `connected`.
 */
export const REVIEW_INTAKE: {
  connected: boolean;
  endpoint: string | null;
} = {
  connected: Boolean(process.env.NEXT_PUBLIC_REVIEW_ENDPOINT),
  endpoint: process.env.NEXT_PUBLIC_REVIEW_ENDPOINT ?? null,
};

export const REVIEW_OFFER = {
  /** Percentage off the next order. */
  percentOff: 15,
  /**
   * The code sent after a review is published. It has to exist in whatever
   * processor eventually takes payment -- nothing here creates it.
   */
  code: "GLOW-REVIEW-15",
  /** Days the code stays valid once issued. */
  validForDays: 90,
  /**
   * Every rating earns the code. Listed in full deliberately: narrowing this
   * to 4 and 5 would turn a lawful incentive into a paid-for rating.
   */
  qualifyingRatings: [1, 2, 3, 4, 5] as const,
  /** Shown on the invitation, next to the offer. */
  terms: [
    "Any honest review qualifies, whatever rating you give. The code is not conditional on a positive review.",
    "Reviews left through this offer are published with a note saying they were incentivized.",
    "One code per order. Valid for 90 days on your next order, and not combinable with other offers.",
    "Reviews are published as written, apart from removing abuse or personal details.",
  ],
} as const;
