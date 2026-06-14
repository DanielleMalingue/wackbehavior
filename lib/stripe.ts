import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Server-only Stripe client. Never import this into client components. */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(key);
  }
  return _stripe;
}

/**
 * Resolve a Stripe Price by its lookup_key. Results are cached in module memory
 * so repeated checkouts don't re-hit the API. Returns the price id.
 */
const priceIdCache = new Map<string, string>();

export async function getPriceIdByLookupKey(lookupKey: string): Promise<string> {
  const cached = priceIdCache.get(lookupKey);
  if (cached) return cached;

  const stripe = getStripe();
  const { data } = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 1,
  });
  const price = data[0];
  if (!price) {
    throw new Error(
      `No active Stripe price found for lookup_key "${lookupKey}". Run "npm run setup:stripe".`,
    );
  }
  priceIdCache.set(lookupKey, price.id);
  return price.id;
}
