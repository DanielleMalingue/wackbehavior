"use client";
import { useState } from "react";
import Link from "next/link";
import Nav from "../components/Nav";
import styles from "./page.module.css";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
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
            <h1 className={styles.title}>Start for free</h1>
            <p className={styles.subtitle}>
              8 credits on us. No card required.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">Full name</label>
              <input
                id="name"
                className={styles.input}
                type="text"
                placeholder="Danielle Malingue"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
              <label className={styles.label} htmlFor="password">Password</label>
              <input
                id="password"
                className={styles.input}
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or</span>
            <span className={styles.dividerLine} />
          </div>

          <div className={styles.socialBtns}>
            <button className={styles.socialBtn}>
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          <p className={styles.switchText}>
            Already have an account?{" "}
            <Link href="/signin" className={styles.switchLink}>Sign in</Link>
          </p>

          <p className={styles.terms}>
            By creating an account you agree to our{" "}
            <Link href="/terms" className={styles.termsLink}>Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className={styles.termsLink}>Privacy Policy</Link>.
          </p>
        </div>

        <div className={styles.aside}>
          <div className={styles.asideInner}>
            <p className={styles.asideQuote}>
              "I launched my first drop with zero photoshoot budget. Wackbehavior
              generated my entire lookbook in two days and it sold out before my
              samples even arrived."
            </p>
            <p className={styles.asideAuthor}>Maya Okonkwo · Los Angeles, CA</p>
            <ul className={styles.perks}>
              {[
                "8 free credits to start",
                "No credit card required",
                "AI fashion sketches in seconds",
                "Campaign-ready imagery",
                "Cancel anytime",
              ].map((p) => (
                <li key={p} className={styles.perk}>
                  <span className={styles.perkCheck}>✓</span> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
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
