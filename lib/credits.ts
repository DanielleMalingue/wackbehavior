import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export class InsufficientCreditsError extends Error {
  constructor(public available: number, public required: number) {
    super("Insufficient credits");
    this.name = "InsufficientCreditsError";
  }
}

/**
 * Atomically reserve (deduct) credits before doing paid work. Throws
 * InsufficientCreditsError if the user can't afford it. Returns the new balance.
 */
export async function reserveCredits(uid: string, cost: number): Promise<number> {
  const ref = adminDb().collection("users").doc(uid);
  return adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const available = (snap.get("credits") as number | undefined) ?? 0;
    if (available < cost) {
      throw new InsufficientCreditsError(available, cost);
    }
    tx.set(
      ref,
      {
        credits: available - cost,
        creditsUpdatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return available - cost;
  });
}

/** Refund reserved credits if the paid work fails after reservation. */
export async function refundCredits(uid: string, cost: number): Promise<void> {
  await adminDb()
    .collection("users")
    .doc(uid)
    .set(
      { credits: FieldValue.increment(cost) },
      { merge: true },
    );
}

export interface DesignRecord {
  uid: string;
  type: "sketch" | "ecommerce" | "campaign" | "ghost";
  prompt: string;
  imageUrls: string[];
  inputs?: Record<string, unknown>;
  cost: number;
  model: string;
}

/** Persist a generated design so it shows in the user's gallery. */
export async function saveDesign(
  record: DesignRecord,
): Promise<{ id: string } & DesignRecord & { createdAt: number }> {
  const doc = await adminDb()
    .collection("designs")
    .add({ ...record, createdAt: FieldValue.serverTimestamp() });
  return { id: doc.id, ...record, createdAt: Date.now() };
}
