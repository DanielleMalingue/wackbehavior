import { randomUUID } from "crypto";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Server-only Firebase Admin. Requires a service-account key. Provide it as a
// single env var FIREBASE_SERVICE_ACCOUNT_KEY containing either the raw JSON
// or a base64-encoded copy of the service-account JSON file.
let _app: App | null = null;

function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length) {
    _app = getApps()[0];
    return _app;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set");
  }

  // Accept either raw JSON or base64-encoded JSON.
  const json = raw.trim().startsWith("{")
    ? raw
    : Buffer.from(raw, "base64").toString("utf8");
  const serviceAccount = JSON.parse(json);

  _app = initializeApp({ credential: cert(serviceAccount) });
  return _app;
}

export function adminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function adminDb(): Firestore {
  return getFirestore(getAdminApp());
}

function bucketName(): string {
  const name =
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!name) throw new Error("Firebase storage bucket is not configured");
  return name;
}

/**
 * Upload image bytes to Firebase Storage and return a stable, public download
 * URL (using a Firebase download token, so no public-bucket config is needed).
 */
export async function uploadImage(
  path: string,
  data: Uint8Array | Buffer,
  contentType: string,
): Promise<string> {
  const bucket = getStorage(getAdminApp()).bucket(bucketName());
  const file = bucket.file(path);
  const token = randomUUID();
  await file.save(Buffer.from(data), {
    contentType,
    metadata: { metadata: { firebaseStorageDownloadTokens: token } },
  });
  const encoded = encodeURIComponent(path);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName()}/o/${encoded}?alt=media&token=${token}`;
}

/**
 * Verify a Firebase ID token from a request's Authorization header and return
 * the decoded uid + email. Throws if missing/invalid.
 */
export async function requireUser(
  authHeader: string | null,
): Promise<{ uid: string; email: string | null }> {
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;
  if (!token) {
    throw new Error("Missing Authorization bearer token");
  }
  const decoded = await adminAuth().verifyIdToken(token);
  return { uid: decoded.uid, email: decoded.email ?? null };
}
