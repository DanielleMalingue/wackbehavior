"use client";
import { getFirebaseAuth } from "@/lib/firebase";

export interface Design {
  id: string;
  uid: string;
  type: "sketch" | "ecommerce" | "campaign" | "ghost";
  prompt: string;
  imageUrls: string[];
  inputs?: Record<string, unknown>;
  cost: number;
  model: string;
  createdAt?: number;
}

class GenerationError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new GenerationError("You must be signed in.", 401);
  const token = await user.getIdToken();
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const msg =
      res.status === 402
        ? "You don't have enough credits for this. Top up or upgrade your plan."
        : (data.error as string) || "Generation failed.";
    throw new GenerationError(msg, res.status);
  }
  return data as T;
}

export async function generateSketch(inputs: {
  color: string;
  fabric: string;
  fit: string;
  details: string;
}): Promise<Design> {
  const { design } = await post<{ design: Design }>("/api/generate/sketch", inputs);
  return design;
}

export async function generatePhoto(opts: {
  mode: "ecommerce" | "campaign" | "ghost";
  designId?: string;
  imageBase64?: string;
  prompt?: string;
  n?: number;
}): Promise<Design> {
  const { design } = await post<{ design: Design }>("/api/generate/photo", opts);
  return design;
}

export async function expandDescription(inputs: {
  color: string;
  fabric: string;
  fit: string;
  details: string;
}): Promise<string> {
  const { text } = await post<{ text: string }>("/api/generate/expand", inputs);
  return text;
}
