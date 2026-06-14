import "server-only";
import { generateImage, generateText, gateway } from "ai";

// All model access goes through the Vercel AI Gateway (one AI_GATEWAY_API_KEY).
// Models are env-configurable so you can swap them without code changes.
const IMAGE_MODEL = process.env.AI_IMAGE_MODEL || "openai/gpt-image-1";
const TEXT_MODEL = process.env.AI_TEXT_MODEL || "google/gemini-2.5-flash";

export interface SketchInputs {
  color: string;
  fabric: string;
  fit: string;
  details: string;
}

export type PhotoMode = "ecommerce" | "campaign" | "ghost";

/** Build a fashion-flat (technical sketch) prompt from the create-form inputs. */
export function buildSketchPrompt(i: SketchInputs): string {
  return [
    "Professional fashion technical flat sketch (CAD-style garment illustration).",
    "Show the garment as a clean front view and back view, side by side, on a plain white background.",
    "No human model, no mannequin — flat lay illustration only. Accurate seams, stitching, closures, and proportions.",
    `Primary color: ${i.color}.`,
    `Fabric: ${i.fabric}.`,
    `Fit / silhouette: ${i.fit}.`,
    `Design details: ${i.details}`,
  ].join("\n");
}

/** Build a photo-studio prompt for the chosen mode. */
export function buildPhotoPrompt(mode: PhotoMode, extra?: string): string {
  const base =
    "Use the provided garment design as the exact reference. Keep the garment's silhouette, color, fabric, construction, and details faithful and consistent.";
  const byMode: Record<PhotoMode, string> = {
    ecommerce:
      "Render a clean studio e-commerce product photo of this garment worn by a professional fashion model, full body, neutral pose, soft even lighting, seamless white background. Sharp focus, true-to-life color.",
    campaign:
      "Render an editorial fashion campaign image of this garment on a model, with cinematic creative direction, styled set, dramatic lighting, and a high-fashion magazine aesthetic.",
    ghost:
      "Render a ghost-mannequin (invisible mannequin) product photo of this garment: hollow 3D form, no model, no mannequin visible, clean white background, showing how the garment sits when worn.",
  };
  return [base, byMode[mode], extra?.trim()].filter(Boolean).join("\n");
}

export interface GeneratedImage {
  base64: string;
  mediaType: string;
  uint8Array: Uint8Array;
}

/**
 * Generate one or more garment images via the AI Gateway. Pass `referenceImages`
 * (raw bytes) to do reference-based editing (e.g. sketch → product photo).
 */
export async function generateGarmentImages(opts: {
  prompt: string;
  referenceImages?: Uint8Array[];
  n?: number;
  size?: string;
}): Promise<GeneratedImage[]> {
  const { prompt, referenceImages, n = 1, size = "1024x1536" } = opts;

  const { images } = await generateImage({
    model: gateway.image(IMAGE_MODEL),
    prompt:
      referenceImages && referenceImages.length
        ? { text: prompt, images: referenceImages }
        : prompt,
    n,
    size,
  });

  return images.map((img) => ({
    base64: img.base64,
    mediaType: img.mediaType,
    uint8Array: img.uint8Array,
  }));
}

/** Expand the create-form inputs into a richer, detailed design description. */
export async function expandDescription(i: SketchInputs): Promise<string> {
  const { text } = await generateText({
    model: TEXT_MODEL,
    prompt: [
      "You are a senior fashion designer writing a precise garment description for an AI image generator.",
      "Expand the following into a single vivid paragraph (120–180 words) describing construction (necklines, seams, closures, hemlines, sleeves), how the fabric drapes and moves, and the styling context/mood. Do not use bullet points or headings. Do not invent a different garment — stay true to the inputs.",
      `Primary color: ${i.color || "(unspecified)"}`,
      `Fabric: ${i.fabric || "(unspecified)"}`,
      `Fit: ${i.fit || "(unspecified)"}`,
      `Notes: ${i.details || "(none)"}`,
    ].join("\n"),
  });
  return text.trim();
}
