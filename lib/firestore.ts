import { getFirestore, type Firestore } from "firebase/firestore";
import getApp from "@/lib/firebase";

// Kept in its own module so the (heavy) Firestore SDK is only bundled into the
// pages that actually read from it, not every page that uses Firebase Auth.
let _db: Firestore | null = null;

export function getFirebaseDb(): Firestore {
  if (!_db) {
    _db = getFirestore(getApp());
  }
  return _db;
}
