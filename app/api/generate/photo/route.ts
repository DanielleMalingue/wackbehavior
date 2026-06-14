import { NextResponse } from "next/server";
import { adminDb, requireUser, uploadImage } from "@/lib/firebase-admin";
import {
  reserveCredits,
  refundCredits,
  saveDesign,
  InsufficientCreditsError,
} from "@/lib/credits";
import { buildPhotoPrompt, generateGarmentImages, type PhotoMode } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type Body = {
  mode?: PhotoMode;
  designId?: string;
  imageBase64?: string; // data URL or raw base64 for an uploaded garment/sketch
  prompt?: string;
  n?: number;
};

const MODES: PhotoMode[] = ["ecommerce", "campaign", "ghost"];

function decodeBase64(input: string): Uint8Array {
  const raw = input.includes(",") ? input.split(",")[1] : input;
  return new Uint8Array(Buffer.from(raw, "base64"));
}

export async function POST(req: Request) {
  let user: { uid: string; email: string | null };
  try {
    user = await requireUser(req.headers.get("authorization"));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Body;
  const mode = body.mode && MODES.includes(body.mode) ? body.mode : null;
  if (!mode) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }
  const n = Math.min(Math.max(Number(body.n) || 4, 1), 4);

  // Resolve the reference garment image (either a saved design or an upload).
  let reference: Uint8Array | null = null;
  try {
    if (body.designId) {
      const snap = await adminDb().collection("designs").doc(body.designId).get();
      if (!snap.exists || snap.get("uid") !== user.uid) {
        return NextResponse.json({ error: "Design not found" }, { status: 404 });
      }
      const url = (snap.get("imageUrls") as string[] | undefined)?.[0];
      if (url) {
        const res = await fetch(url);
        reference = new Uint8Array(await res.arrayBuffer());
      }
    } else if (body.imageBase64) {
      reference = decodeBase64(body.imageBase64);
    }
  } catch (err) {
    console.error("reference load failed", err);
  }
  if (!reference) {
    return NextResponse.json(
      { error: "A garment image is required" },
      { status: 400 },
    );
  }

  const cost = n;
  try {
    await reserveCredits(user.uid, cost);
  } catch (err) {
    if (err instanceof InsufficientCreditsError) {
      return NextResponse.json(
        { error: "Not enough credits", available: err.available },
        { status: 402 },
      );
    }
    throw err;
  }

  try {
    const prompt = buildPhotoPrompt(mode, body.prompt);
    const images = await generateGarmentImages({
      prompt,
      referenceImages: [reference],
      n,
    });
    const urls = await Promise.all(
      images.map((img, i) =>
        uploadImage(
          `designs/${user.uid}/${Date.now()}-${i}.png`,
          img.uint8Array,
          img.mediaType || "image/png",
        ),
      ),
    );
    const design = await saveDesign({
      uid: user.uid,
      type: mode,
      prompt,
      imageUrls: urls,
      cost,
      model: process.env.AI_IMAGE_MODEL || "openai/gpt-image-1",
    });
    return NextResponse.json({ design });
  } catch (err) {
    console.error("photo generation failed", err);
    await refundCredits(user.uid, cost).catch(() => {});
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
