import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { FieldValue } from "firebase-admin/firestore";
import { getStripe } from "@/lib/stripe";
import { adminDb } from "@/lib/firebase-admin";
import { PLAN_TIERS, type PlanId } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe sends events here to fulfill purchases. Configure the endpoint URL
// (<your-domain>/api/stripe/webhook) in the Stripe dashboard and put the signing
// secret in STRIPE_WEBHOOK_SECRET. For local testing use the Stripe CLI:
//   stripe listen --forward-to localhost:3000/api/stripe/webhook
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const stripe = getStripe();
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: ignore events we've already processed.
  const eventRef = adminDb().collection("stripe_events").doc(event.id);
  if ((await eventRef.get()).exists) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const uid = session.metadata?.firebaseUid;
        if (!uid) break;

        if (session.mode === "subscription") {
          const plan = session.metadata?.plan as PlanId | undefined;
          const billing = session.metadata?.billing;
          const tier = plan ? PLAN_TIERS[plan] : undefined;
          if (tier) {
            await adminDb().collection("users").doc(uid).set(
              {
                plan,
                billing,
                subscriptionStatus: "active",
                stripeSubscriptionId: session.subscription,
                credits: tier.monthlyCredits,
                creditsUpdatedAt: FieldValue.serverTimestamp(),
              },
              { merge: true },
            );
          }
        } else if (session.mode === "payment") {
          // One-time credit top-up.
          const credits = Number(session.metadata?.credits ?? 0);
          if (credits > 0) {
            await adminDb().collection("users").doc(uid).set(
              {
                credits: FieldValue.increment(credits),
                creditsUpdatedAt: FieldValue.serverTimestamp(),
              },
              { merge: true },
            );
          }
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        // Only refill on renewals; the first invoice is handled by
        // checkout.session.completed above.
        if (invoice.billing_reason !== "subscription_cycle") break;

        const subId = resolveSubscriptionId(invoice);
        if (!subId) break;
        const sub = await stripe.subscriptions.retrieve(subId);
        const uid = sub.metadata?.firebaseUid;
        const plan = sub.metadata?.plan as PlanId | undefined;
        const tier = plan ? PLAN_TIERS[plan] : undefined;
        if (uid && tier) {
          await adminDb().collection("users").doc(uid).set(
            {
              plan,
              subscriptionStatus: "active",
              credits: tier.monthlyCredits, // reset to monthly allotment
              creditsUpdatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true },
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const uid = sub.metadata?.firebaseUid;
        if (uid) {
          await adminDb().collection("users").doc(uid).set(
            {
              subscriptionStatus: sub.status,
              cancelAtPeriodEnd: sub.cancel_at_period_end,
            },
            { merge: true },
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const uid = sub.metadata?.firebaseUid;
        if (uid) {
          await adminDb().collection("users").doc(uid).set(
            {
              plan: "trial",
              subscriptionStatus: "canceled",
              cancelAtPeriodEnd: false,
              stripeSubscriptionId: FieldValue.delete(),
            },
            { merge: true },
          );
        }
        break;
      }

      default:
        break;
    }

    await eventRef.set({
      type: event.type,
      processedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`Error handling ${event.type}`, err);
    // Return 500 so Stripe retries.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

// `invoice.subscription` location has shifted across Stripe API versions; check
// the known spots defensively.
function resolveSubscriptionId(invoice: Stripe.Invoice): string | null {
  const inv = invoice as unknown as {
    subscription?: string | { id: string } | null;
    lines?: { data?: Array<{ subscription?: string | { id: string } | null }> };
  };
  const direct = inv.subscription;
  if (typeof direct === "string") return direct;
  if (direct && typeof direct === "object") return direct.id;
  const line = inv.lines?.data?.[0]?.subscription;
  if (typeof line === "string") return line;
  if (line && typeof line === "object") return line.id;
  return null;
}
