// Single source of truth for billing: plan tiers, credit allotments, and the
// Stripe price "lookup_key"s used to resolve prices at runtime. The setup
// script (scripts/setup-stripe.mjs) creates Stripe Products/Prices using these
// same lookup keys, so no price IDs ever need to be hand-copied.

export type PlanId = "basic" | "pro" | "studio" | "agency";
export type Billing = "monthly" | "annual";

export interface PlanTier {
  id: PlanId;
  name: string;
  /** Credits granted at the start of each monthly billing period. */
  monthlyCredits: number;
  /** Displayed per-month price in whole dollars. */
  monthly: number;
  annual: number;
  description: string;
}

// Per-month dollar prices mirror app/components/PricingSection.tsx and
// app/dashboard/plans/page.tsx. Annual is billed once a year at 12x the
// annual per-month rate (~20% cheaper than monthly).
export const PLAN_TIERS: Record<PlanId, PlanTier> = {
  basic: {
    id: "basic",
    name: "Basic",
    monthlyCredits: 40,
    monthly: 19,
    annual: 15,
    description: "Best for testing your first garment end to end.",
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthlyCredits: 250,
    monthly: 55,
    annual: 44,
    description: "Best for active creators shipping monthly drops of 3–5 garments.",
  },
  studio: {
    id: "studio",
    name: "Studio",
    monthlyCredits: 500,
    monthly: 79,
    annual: 63,
    description: "Best for growing brands designing 10+ garments per month.",
  },
  agency: {
    id: "agency",
    name: "Agency",
    monthlyCredits: 1500,
    monthly: 199,
    annual: 159,
    description:
      "Best for agencies and heavy creators managing multiple brands or weekly drops.",
  },
};

export interface TopUp {
  id: string;
  credits: number;
  /** One-time price in whole dollars. */
  price: number;
}

export const TOPUPS: Record<string, TopUp> = {
  "25": { id: "25", credits: 25, price: 20 },
  "100": { id: "100", credits: 100, price: 60 },
  "300": { id: "300", credits: 300, price: 150 },
};

/** Stripe price lookup_key for a subscription tier + billing interval. */
export function subscriptionLookupKey(plan: PlanId, billing: Billing): string {
  return `wb_${plan}_${billing}`;
}

/** Stripe price lookup_key for a one-time credit pack. */
export function topupLookupKey(id: string): string {
  return `wb_topup_${id}`;
}

/** Stripe interval for a billing choice. */
export function stripeInterval(billing: Billing): "month" | "year" {
  return billing === "monthly" ? "month" : "year";
}

/** Amount in cents Stripe should charge for a subscription price. */
export function subscriptionAmountCents(plan: PlanId, billing: Billing): number {
  const tier = PLAN_TIERS[plan];
  return billing === "monthly"
    ? tier.monthly * 100
    : tier.annual * 12 * 100; // billed once per year
}

/** The promotion code shown in marketing copy ("25% off first month"). */
export const PROMO_CODE = "NEW24";
export const PROMO_PERCENT_OFF = 25;
