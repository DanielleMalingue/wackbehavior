"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import Nav from "../components/Nav";
import styles from "./page.module.css";

const googleProvider = new GoogleAuthProvider();

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithPopup(getFirebaseAuth(), googleProvider);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(friendlyError(err));
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email above first.");
      return;
    }
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email);
      setResetSent(true);
      setError("");
    } catch (err: unknown) {
      setError(friendlyError(err));
    }
  }

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>Sign in to your Wackbehavior account</p>
          </div>

          <button
            className={styles.socialBtn}
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            <GoogleIcon />
            {googleLoading ? "Signing in…" : "Continue with Google"}
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or</span>
            <span className={styles.dividerLine} />
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {error && <p className={styles.error}>{error}</p>}
            {resetSent && (
              <p className={styles.success}>
                Reset link sent — check your inbox.
              </p>
            )}

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input
                id="email"
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="password">Password</label>
                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                className={styles.input}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className={styles.switchText}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className={styles.switchLink}>
              Start free →
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}

function friendlyError(err: unknown): string {
  if (typeof err === "object" && err !== null && "code" in err) {
    const code = (err as { code: string }).code;
    if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential")
      return "Incorrect email or password.";
    if (code === "auth/invalid-email") return "Please enter a valid email.";
    if (code === "auth/too-many-requests") return "Too many attempts. Try again later.";
    if (code === "auth/popup-closed-by-user") return "";
    if (code === "auth/cancelled-popup-request") return "";
    if (code === "auth/popup-blocked")
      return "Your browser blocked the sign-in popup. Allow popups for this site and try again.";
    if (code === "auth/unauthorized-domain")
      return "This domain isn't authorized for Google sign-in. Add it under Firebase Authentication → Settings → Authorized domains.";
    if (code === "auth/operation-not-allowed")
      return "Google sign-in isn't enabled. Enable it in Firebase Authentication → Sign-in method.";
    return `Sign-in failed (${code}). Please try again.`;
  }
  return "Something went wrong. Please try again.";
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
