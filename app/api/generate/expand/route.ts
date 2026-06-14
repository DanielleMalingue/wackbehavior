import { NextResponse } from "next/server";
import { requireUser } from "@/lib/firebase-admin";
import { expandDescription, type SketchInputs } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Free helper: turns the form inputs into a richer design description.
export async function POST(req: Request) {
  try {
    await requireUser(req.headers.get("authorization"));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Partial<SketchInputs>;
  try {
    const text = await expandDescription({
      color: body.color || "",
      fabric: body.fabric || "",
      fit: body.fit || "",
      details: body.details || "",
    });
    return NextResponse.json({ text });
  } catch (err) {
    console.error("expand failed", err);
    return NextResponse.json({ error: "Could not expand description" }, { status: 500 });
  }
}
