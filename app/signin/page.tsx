"use client";
import { useState } from "react";
import Link from "next/link";
import Nav from "../components/Nav";
import styles from "./page.module.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    // auth logic goes here
    setTimeout(() => setLoading(false), 1200);
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

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {error && <p className={styles.error}>{error}</p>}

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
                <Link href="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
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

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
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
