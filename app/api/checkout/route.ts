import { NextResponse } from "next/server";
import { getStripe, getPriceIdByLookupKey } from "@/lib/stripe";
import { adminDb, requireUser } from "@/lib/firebase-admin";
import {
  PLAN_TIERS,
  TOPUPS,
  subscriptionLookupKey,
  topupLookupKey,
  type PlanId,
  type Billing,
} from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutBody =
  | { kind: "subscription"; plan: PlanId; billing: Billing }
  | { kind: "topup"; topupId: string };

function originFrom(req: Request): string {
  return (
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  );
}

/**
 * Return the user's Stripe customer id, creating + persisting one on first use.
 */
async function getOrCreateCustomer(uid: string, email: string | null) {
  const stripe = getStripe();
  const userRef = adminDb().collection("users").doc(uid);
  const snap = await userRef.get();
  const existing = snap.get("stripeCustomerId") as string | undefined;
  if (existing) return existing;

  const customer = await stripe.customers.create({
    email: email ?? undefined,
    metadata: { firebaseUid: uid },
  });
  await userRef.set(
    { stripeCustomerId: customer.id, email },
    { merge: true },
  );
  return customer.id;
}

export async function POST(req: Request) {
  let user: { uid: string; email: string | null };
  try {
    user = await requireUser(req.headers.get("authorization"));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = originFrom(req);

  try {
    const customer = await getOrCreateCustomer(user.uid, user.email);

    if (body.kind === "subscription") {
      const tier = PLAN_TIERS[body.plan];
      if (!tier || (body.billing !== "monthly" && body.billing !== "annual")) {
        return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
      }
      const priceId = await getPriceIdByLookupKey(
        subscriptionLookupKey(body.plan, body.billing),
      );
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer,
        line_items: [{ price: priceId, quantity: 1 }],
        allow_promotion_codes: true,
        client_reference_id: user.uid,
        subscription_data: {
          metadata: { firebaseUid: user.uid, plan: body.plan, billing: body.billing },
        },
        metadata: { firebaseUid: user.uid, plan: body.plan, billing: body.billing },
        success_url: `${origin}/dashboard/plans?status=success`,
        cancel_url: `${origin}/dashboard/plans?status=cancelled`,
      });
      return NextResponse.json({ url: session.url });
    }

    if (body.kind === "topup") {
      const pack = TOPUPS[body.topupId];
      if (!pack) {
        return NextResponse.json({ error: "Unknown top-up" }, { status: 400 });
      }
      const priceId = await getPriceIdByLookupKey(topupLookupKey(pack.id));
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer,
        line_items: [{ price: priceId, quantity: 1 }],
        client_reference_id: user.uid,
        payment_intent_data: {
          metadata: {
            firebaseUid: user.uid,
            topupId: pack.id,
            credits: String(pack.credits),
          },
        },
        metadata: {
          firebaseUid: user.uid,
          topupId: pack.id,
          credits: String(pack.credits),
        },
        success_url: `${origin}/dashboard/plans?status=success`,
        cancel_url: `${origin}/dashboard/plans?status=cancelled`,
      });
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  } catch (err) {
    console.error("checkout error", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
