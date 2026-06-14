// One-time (idempotent) Stripe setup: creates Products, Prices, and the NEW24
// promotion code in your account using stable lookup_keys, so the app can
// resolve prices without any hand-copied IDs.
//
// Run with:  npm run setup:stripe
// (loads STRIPE_SECRET_KEY from .env.local via node --env-file)

import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("✗ STRIPE_SECRET_KEY is not set (add it to .env.local).");
  process.exit(1);
}
const stripe = new Stripe(key);

// Keep these in sync with lib/plans.ts.
const PLAN_TIERS = [
  { id: "basic", name: "Basic", monthly: 19, annual: 15 },
  { id: "pro", name: "Pro", monthly: 55, annual: 44 },
  { id: "studio", name: "Studio", monthly: 79, annual: 63 },
  { id: "agency", name: "Agency", monthly: 199, annual: 159 },
];
const TOPUPS = [
  { id: "25", credits: 25, price: 20 },
  { id: "100", credits: 100, price: 60 },
  { id: "300", credits: 300, price: 150 },
];

async function ensureProduct(wbId, name) {
  const found = await stripe.products.search({
    query: `metadata['wb_id']:'${wbId}'`,
  });
  if (found.data[0]) return found.data[0];
  return stripe.products.create({ name, metadata: { wb_id: wbId } });
}

async function ensurePrice({ lookupKey, productId, amount, recurring }) {
  const existing = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 1,
  });
  if (existing.data[0]) {
    console.log(`  = ${lookupKey} (exists)`);
    return existing.data[0];
  }
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: amount,
    currency: "usd",
    lookup_key: lookupKey,
    transfer_lookup_key: true,
    ...(recurring ? { recurring } : {}),
  });
  console.log(`  + ${lookupKey} → ${price.id}`);
  return price;
}

async function main() {
  console.log("Setting up subscription plans…");
  for (const tier of PLAN_TIERS) {
    const product = await ensureProduct(
      `plan_${tier.id}`,
      `Wackbehavior ${tier.name}`,
    );
    await ensurePrice({
      lookupKey: `wb_${tier.id}_monthly`,
      productId: product.id,
      amount: tier.monthly * 100,
      recurring: { interval: "month" },
    });
    await ensurePrice({
      lookupKey: `wb_${tier.id}_annual`,
      productId: product.id,
      amount: tier.annual * 12 * 100, // billed once per year
      recurring: { interval: "year" },
    });
  }

  console.log("Setting up credit top-ups…");
  for (const t of TOPUPS) {
    const product = await ensureProduct(
      `topup_${t.id}`,
      `Wackbehavior ${t.credits} Credits`,
    );
    await ensurePrice({
      lookupKey: `wb_topup_${t.id}`,
      productId: product.id,
      amount: t.price * 100,
    });
  }

  console.log("Setting up NEW24 promo (25% off first month)…");
  let coupon;
  try {
    coupon = await stripe.coupons.retrieve("wb_new24");
    console.log("  = coupon wb_new24 (exists)");
  } catch {
    coupon = await stripe.coupons.create({
      id: "wb_new24",
      percent_off: 25,
      duration: "once",
      name: "NEW24",
    });
    console.log("  + coupon wb_new24");
  }
  const promos = await stripe.promotionCodes.list({ code: "NEW24", limit: 1 });
  if (!promos.data[0]) {
    await stripe.promotionCodes.create({ coupon: coupon.id, code: "NEW24" });
    console.log("  + promotion code NEW24");
  } else {
    console.log("  = promotion code NEW24 (exists)");
  }

  console.log("\n✓ Stripe setup complete.");
}

main().catch((err) => {
  console.error("\n✗ Setup failed:", err.message);
  process.exit(1);
});
