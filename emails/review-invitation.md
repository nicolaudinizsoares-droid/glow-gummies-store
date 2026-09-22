# Review invitation — post-purchase email

Copy for the message that asks a customer to review their order. Paste into
whatever sends mail (Klaviyo, Resend, Loops, Mailchimp); nothing here sends it.

Pairs with `/review` and `src/lib/review-invite.ts`. If the offer changes,
change it in that file first — the page reads from it, this file does not.

---

## When to send

**21 days after delivery.** Not after the order, after it arrives.

Three weeks is the point where someone has taken roughly two thirds of the
bottle. They have a real opinion about the taste, the texture and whether two
a day fits their morning — which is what a useful review is made of, and what
another shopper is actually deciding on.

It is deliberately not sooner. At day three they can only review the packaging.

It is also not framed around results. Biotin and collagen work on a timescale
of two to three months, so a review at three weeks cannot honestly speak to
hair or nails, and an email that invites one at that point is fishing for a
claim the customer cannot make. If you want results reviews, send a second,
separate message at 90 days to people who reordered.

**Send once.** A reminder to people who did not respond reads as pressure for
something you are paying for.

---

## Subject lines

Pick one and hold it — do not rotate between sends.

1. `How are the gummies?`
2. `Three weeks in — what do you think?`
3. `Tell us honestly, get 15% off`

The first is the safest and usually the best. It asks a real question rather
than leading with the transaction.

**Preheader:** `Any honest review gets you 15% off your next order.`

---

## Body

Merge tags in `{{ }}`. Every one must resolve — an email that opens
"Hi ," undoes the tone in the first two words.

```
Hi {{first_name}},

Your Glow gummies arrived about three weeks ago, so you have had long
enough to know what you make of them.

Would you write a review? It takes a couple of minutes, and we will send
you a code for 15% off your next order once it is published.

  {{review_url}}

One thing worth saying plainly: the code is the same whatever rating you
give. We would rather have twenty honest reviews than a hundred glowing
ones nobody believes. If the gummies were not for you, that is genuinely
useful for the next person deciding.

Reviews left through this offer are published with a note saying they
came with a discount attached. That is a rule we follow, and it is also
the reason the ones on the site are worth reading.

Thank you,
The Glow team

--
Order {{order_number}}
Any rating qualifies. One code per order, valid 90 days on your next
order, not combinable with other offers.
Reviews are published as written, apart from removing abuse or personal
details.

{{company_address}}
Unsubscribe: {{unsubscribe_url}}
```

---

## Rules this copy is built on

Both come from the FTC rule on consumer reviews and testimonials. The UK DMCC
Act and the EU Omnibus Directive say substantially the same thing.

**The reward cannot depend on the rating.** So the email never says "if you
loved them", never asks for five stars, and states the opposite outright.

**Never gate.** Do not ask "how did we do?" first and send only the happy
customers to the review page. Routing by sentiment is exactly the practice the
rule was written for, and every major email tool ships a template that does it.

**The incentive is disclosed twice** — here, and on each published review via
the `incentivized` field. Do not remove either.

**CAN-SPAM:** a physical mailing address and a working unsubscribe link are
required, not optional.

---

## Before this can send

1. A payment processor, so orders and delivery dates exist to trigger on
2. `NEXT_PUBLIC_REVIEW_ENDPOINT` pointed at something that stores submissions
3. A sender, with the trigger set to 21 days after delivery
4. `GLOW-REVIEW-15` created in the processor — nothing in this repo creates it,
   and the code will fail at checkout until it exists
5. A way to email the code once a review is published
