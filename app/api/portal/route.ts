import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { adminDb, requireUser } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Opens the Stripe Billing Portal so a customer can update payment methods,
// view invoices, or cancel their subscription.
export async function POST(req: Request) {
  let user: { uid: string; email: string | null };
  try {
    user = await requireUser(req.headers.get("authorization"));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snap = await adminDb().collection("users").doc(user.uid).get();
  const customerId = snap.get("stripeCustomerId") as string | undefined;
  if (!customerId) {
    return NextResponse.json(
      { error: "No billing account yet" },
      { status: 400 },
    );
  }

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard/plans`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("portal error", err);
    return NextResponse.json({ error: "Could not open portal" }, { status: 500 });
  }
}
