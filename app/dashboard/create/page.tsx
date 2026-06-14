"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import styles from "./page.module.css";

const FABRICS = [
  "Cotton",
  "Linen",
  "Silk",
  "Satin",
  "Crepe",
  "Denim",
  "Wool",
  "Knit / Jersey",
  "Leather",
  "Chiffon",
  "Velvet",
  "Polyester blend",
];

const FITS = [
  "Slim",
  "Regular",
  "Oversized",
  "Tailored",
  "Relaxed",
  "Bodycon",
  "Cropped",
  "A-line",
  "Straight",
];

const EXAMPLES = [
  {
    color: "Butter Yellow",
    fabric: "Linen",
    fit: "Cropped",
    details:
      "Halter neckline with adjustable buckle strap, open back with thin cross ties, fitted cropped bodice with princess seams for shaping, paired with high-rise wide-leg pants featuring a fold-over waistband, side invisible zipper closure, and relaxed drape through the leg.",
  },
  {
    color: "Black",
    fabric: "Satin",
    fit: "Bodycon",
    details:
      "Strapless structured evening gown with a fitted corset bodice, subtle boning for support, sweetheart neckline with a gentle dip, smooth princess seam construction through the torso, high waist seam transitioning into a floor-length fitted skirt with a dramatic thigh-high front slit, invisible back zipper closure, and a small fishtail sweep at the hem.",
  },
  {
    color: "Ivory",
    fabric: "Crepe",
    fit: "Tailored",
    details:
      "Deep V wrap blouse with full-length bishop sleeves gathered into buttoned cuffs, self-fabric waist tie with side closure, darted bust for a clean fit, paired with wide-leg high-waisted trousers featuring front pressed creases, hook-and-bar waistband closure, slant front pockets, and a full-length relaxed drape through the leg.",
  },
];

const PLACEHOLDER =
  "e.g. Strapless structured bodice with subtle boning, sweetheart neckline with a gentle dip, princess seam construction through the torso. High waist seam transitions into a floor-length fitted skirt with dramatic thigh-high front slit. Invisible back zipper, small fishtail sweep at the hem. Worn for black-tie evening events, old Hollywood glamour meets modern minimalism. Fabric should drape with weight and catch light subtly.";

export default function CreateDesign() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [color, setColor] = useState("");
  const [fabric, setFabric] = useState("");
  const [fit, setFit] = useState("");
  const [details, setDetails] = useState("");
  const [notice, setNotice] = useState("");

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

  const wordCount = details.trim() ? details.trim().split(/\s+/).length : 0;
  const canGenerate = color.trim() && fabric && fit && details.trim().length > 0;

  function useExample(ex: (typeof EXAMPLES)[number]) {
    setColor(ex.color);
    setFabric(ex.fabric);
    setFit(ex.fit);
    setDetails(ex.details);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleGenerate() {
    if (!canGenerate) return;
    // TODO: wire to the image-generation backend.
    setNotice(
      "Sketch generation isn't connected to an AI backend yet — the form is ready and capturing your inputs."
    );
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <button className={styles.logo} onClick={() => router.push("/dashboard")}>
          WACKBEHAVIOR
        </button>
        <div className={styles.navRight}>
          <span className={styles.credits}>{8} credits</span>
          <button className={styles.backLink} onClick={() => router.push("/dashboard")}>
            ← Dashboard
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create a New Design</h1>
          <p className={styles.subtitle}>Define the essentials, then add your design details.</p>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>
              Primary Color <span className={styles.req}>*</span>
            </label>
            <input
              className={styles.input}
              placeholder="e.g. Butter Yellow"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Fabric Type <span className={styles.req}>*</span>
            </label>
            <select
              className={`${styles.select} ${!fabric ? styles.selectPlaceholder : ""}`}
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
            >
              <option value="" disabled>
                Select fabric
              </option>
              {FABRICS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Fit / Silhouette <span className={styles.req}>*</span>
            </label>
            <select
              className={`${styles.select} ${!fit ? styles.selectPlaceholder : ""}`}
              value={fit}
              onChange={(e) => setFit(e.target.value)}
            >
              <option value="" disabled>
                Select fit
              </option>
              {FITS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.detailsBlock}>
          <label className={styles.label}>Describe the design details</label>
          <textarea
            className={styles.textarea}
            placeholder={PLACEHOLDER}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={12}
          />
          <div className={styles.wordCount}>{wordCount} words</div>
          <p className={styles.helper}>
            The more detail, the more accurate. Describe construction (necklines, seams, closures,
            hemlines), silhouette behavior (how fabric drapes and moves), and context (what it&apos;s
            worn for, the aesthetic, the mood). The best descriptions are 150+ words.
          </p>
          <button className={styles.expandBtn} type="button">
            ✦ Expand Design Description
          </button>
          <p className={styles.expandHint}>Turn a simple idea into a detailed fashion design.</p>
        </div>

        {notice && <div className={styles.notice}>{notice}</div>}

        <div className={styles.actions}>
          <button
            className={styles.generateBtn}
            disabled={!canGenerate}
            onClick={handleGenerate}
          >
            Generate Sketch · 1 credit
          </button>
        </div>

        <div className={styles.examples}>
          <div className={styles.examplesHead}>
            <span className={styles.examplesLabel}>Example Combinations</span>
            <span className={styles.examplesHint}>Tap to use this example</span>
          </div>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.color}
              className={styles.exampleItem}
              onClick={() => useExample(ex)}
            >
              <span className={styles.exampleTitle}>
                {ex.color} · {ex.fabric} · {ex.fit}
              </span>
              <span className={styles.exampleDesc}>{ex.details}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
