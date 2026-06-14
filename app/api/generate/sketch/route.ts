import { NextResponse } from "next/server";
import { requireUser, uploadImage } from "@/lib/firebase-admin";
import {
  reserveCredits,
  refundCredits,
  saveDesign,
  InsufficientCreditsError,
} from "@/lib/credits";
import { buildSketchPrompt, generateGarmentImages, type SketchInputs } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const COST = 1;

export async function POST(req: Request) {
  let user: { uid: string; email: string | null };
  try {
    user = await requireUser(req.headers.get("authorization"));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Partial<SketchInputs>;
  const inputs: SketchInputs = {
    color: (body.color || "").trim(),
    fabric: (body.fabric || "").trim(),
    fit: (body.fit || "").trim(),
    details: (body.details || "").trim(),
  };
  if (!inputs.color || !inputs.fabric || !inputs.fit || !inputs.details) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await reserveCredits(user.uid, COST);
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
    const prompt = buildSketchPrompt(inputs);
    const images = await generateGarmentImages({ prompt, n: 1 });
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
      type: "sketch",
      prompt,
      imageUrls: urls,
      inputs: { ...inputs },
      cost: COST,
      model: process.env.AI_IMAGE_MODEL || "openai/gpt-image-1",
    });
    return NextResponse.json({ design });
  } catch (err) {
    console.error("sketch generation failed", err);
    await refundCredits(user.uid, COST).catch(() => {});
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
