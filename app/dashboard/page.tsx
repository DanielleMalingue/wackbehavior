"use client";
export const dynamic = "force-dynamic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAuth } from "../context/AuthContext";
import styles from "./page.module.css";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  async function handleSignOut() {
    await signOut(getFirebaseAuth());
    router.push("/");
  }

  if (loading || !user) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
      </div>
    );
  }

  const firstName = user.displayName?.split(" ")[0] ?? "there";

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <span className={styles.logo}>WACKBEHAVIOR</span>
        <div className={styles.navRight}>
          <span className={styles.userEmail}>{user.email}</span>
          <button className={styles.signOutBtn} onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.welcome}>
          <h1 className={styles.heading}>Hey, {firstName} 👋</h1>
          <p className={styles.sub}>
            Your studio is ready. Start creating your first design.
          </p>
        </div>

        <div className={styles.creditsBar}>
          <div className={styles.creditsInfo}>
            <span className={styles.creditsLabel}>Credits remaining</span>
            <span className={styles.creditsCount}>8</span>
          </div>
          <a href="#upgrade" className={styles.upgradeLink}>Upgrade plan →</a>
        </div>

        <div className={styles.tools}>
          {[
            {
              icon: "✏️",
              title: "Sketch Studio",
              desc: "Generate front & back flats from a garment description.",
              cta: "Start sketching",
              available: true,
            },
            {
              icon: "📸",
              title: "E-Commerce Studio",
              desc: "Clean product images on Wackbehavior models.",
              cta: "Coming soon",
              available: false,
            },
            {
              icon: "🎬",
              title: "Campaign Studio",
              desc: "Editorial campaign imagery with full creative direction.",
              cta: "Coming soon",
              available: false,
            },
            {
              icon: "💬",
              title: "Ask Wackbehavior",
              desc: "AI brand advisor for content, pricing, and strategy.",
              cta: "Coming soon",
              available: false,
            },
          ].map((tool) => (
            <div
              key={tool.title}
              className={`${styles.toolCard} ${!tool.available ? styles.toolCardDisabled : ""}`}
            >
              <span className={styles.toolIcon}>{tool.icon}</span>
              <h2 className={styles.toolTitle}>{tool.title}</h2>
              <p className={styles.toolDesc}>{tool.desc}</p>
              <button
                className={tool.available ? styles.toolCta : styles.toolCtaDisabled}
                disabled={!tool.available}
              >
                {tool.cta}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
