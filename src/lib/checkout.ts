// Checkout configuration.
//
// Stripe takes the payment, on this page, through the Payment Element. There
// is no redirect to a hosted checkout: the customer stays on the Glow
// checkout from cart to confirmation.
//
// Card data still never touches this codebase. The Payment Element is an
// iframe served by Stripe, so the numbers go straight to them and this site
// stays out of PCI scope.

export const PROCESSOR: {
  connected: boolean;
  name: string | null;
} = {
  // Derived from the publishable key rather than hardcoded, so a deployment
  // without Stripe configured shows the honest "cannot take payment" notice
  // instead of a card box that could never work. The publishable key is safe in
  // the browser by design -- it can start a payment, never read or refund one.
  connected: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
  name: "Stripe",
};

export interface CheckoutDetails {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
}

export const EMPTY_DETAILS: CheckoutDetails = {
  email: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  region: "",
  postcode: "",
  country: "United States",
};

export type CheckoutErrors = Partial<Record<keyof CheckoutDetails, string>>;

/** Fields that must be filled before the order can be handed to a processor. */
const REQUIRED: (keyof CheckoutDetails)[] = [
  "email", "firstName", "lastName", "address1", "city", "region", "postcode", "country",
];

const LABELS: Record<keyof CheckoutDetails, string> = {
  email: "Email",
  firstName: "First name",
  lastName: "Last name",
  address1: "Address",
  address2: "Apartment, suite etc.",
  city: "City",
  region: "State or region",
  postcode: "ZIP or postcode",
  country: "Country",
};

export const fieldLabel = (field: keyof CheckoutDetails) => LABELS[field];

export function validate(details: CheckoutDetails): CheckoutErrors {
  const errors: CheckoutErrors = {};

  for (const field of REQUIRED) {
    if (!details[field].trim()) errors[field] = `${LABELS[field]} is required`;
  }

  // Deliberately permissive: the shape of a valid address varies by country,
  // and rejecting a real customer's real email is worse than accepting a typo
  // the processor will catch.
  if (details.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(details.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  return errors;
}
