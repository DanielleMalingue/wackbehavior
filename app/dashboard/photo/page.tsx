"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import DashNav from "../../components/DashNav";
import styles from "./page.module.css";

type Mode = "ecommerce" | "campaign" | "ghost";

const MODES: { id: Mode; icon: string; label: string }[] = [
  { id: "ecommerce", icon: "🛍", label: "E-Commerce" },
  { id: "campaign", icon: "📣", label: "Campaign" },
  { id: "ghost", icon: "👻", label: "Ghost Mannequin" },
];

const COPY: Record<Mode, { title: string; sub: string; empty: string }> = {
  ecommerce: {
    title: "E-Commerce",
    sub: "Studio-quality product photos from your designs",
    empty: "No e-commerce photos yet",
  },
  campaign: {
    title: "Campaign",
    sub: "Editorial campaign imagery with full creative direction",
    empty: "No campaign photos yet",
  },
  ghost: {
    title: "Ghost Mannequin",
    sub: "Hollow 3D product shots with no model",
    empty: "No ghost mannequin photos yet",
  },
};

const SOURCES = ["Wackbehavior Sketch", "Upload Sketch", "Upload Garment"];

export default function PhotoStudio() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("ecommerce");
  const [source, setSource] = useState(SOURCES[0]);

  useEffect(() => {
    if (!loading && !user) router.push("/signin");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
      </div>
    );
  }

  const copy = COPY[mode];

  return (
    <div className={styles.page}>
      <DashNav credits={8} />

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Photo Studio</h1>
        <p className={styles.heroSub}>
          Transform your designs into professional e-commerce, campaign, and ghost mannequin imagery.
        </p>
        <div className={styles.modeTabs}>
          {MODES.map((m) => (
            <button
              key={m.id}
              className={`${styles.modeTab} ${mode === m.id ? styles.modeTabActive : ""}`}
              onClick={() => setMode(m.id)}
            >
              <span className={styles.modeIcon}>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>
      </div>

      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>{copy.title}</h2>
        <p className={styles.sectionSub}>{copy.sub}</p>

        <div className={styles.gallery}>
          <div className={styles.emptyIcon}>🛍</div>
          <p className={styles.emptyTitle}>{copy.empty}</p>
          <p className={styles.emptySub}>Generate your first set to start your gallery</p>
          <span className={styles.downArrow}>↓</span>
        </div>

        <div className={styles.generateBar}>
          <div className={styles.barLeft}>
            <div className={styles.sourcePills}>
              {SOURCES.map((s) => (
                <button
                  key={s}
                  className={`${styles.sourcePill} ${source === s ? styles.sourceActive : ""}`}
                  onClick={() => setSource(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <button className={styles.chooseBtn}>🖼 Choose garment</button>
            <button className={styles.settingsBtn} aria-label="Settings">
              ⚙
            </button>
          </div>
          <button className={styles.generateBtn} disabled>
            Generate ✦ 4
          </button>
        </div>
        <p className={styles.barHint}>Choose a garment to continue.</p>
      </main>
    </div>
  );
}
