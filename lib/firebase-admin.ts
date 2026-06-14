import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

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
