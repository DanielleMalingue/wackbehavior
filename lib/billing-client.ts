"use client";
import { getFirebaseAuth } from "@/lib/firebase";
import type { PlanId, Billing } from "@/lib/plans";

async function authedPost(path: string, body?: unknown): Promise<string> {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("You must be signed in.");
  const token = await user.getIdToken();
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };
  if (!res.ok || !data.url) {
    throw new Error(data.error || "Something went wrong.");
  }
  return data.url;
}

/** Start Stripe Checkout for a subscription and redirect there. */
export async function checkoutSubscription(plan: PlanId, billing: Billing) {
  const url = await authedPost("/api/checkout", {
    kind: "subscription",
    plan,
    billing,
  });
  window.location.href = url;
}

/** Start Stripe Checkout for a one-time credit top-up and redirect there. */
export async function checkoutTopup(topupId: string) {
  const url = await authedPost("/api/checkout", { kind: "topup", topupId });
  window.location.href = url;
}

/** Open the Stripe Billing Portal to manage/cancel a subscription. */
export async function openBillingPortal() {
  const url = await authedPost("/api/portal");
  window.location.href = url;
}
