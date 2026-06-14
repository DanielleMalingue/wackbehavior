"use client";
import { useEffect, useState } from "react";
import styles from "./Onboarding.module.css";

const TOTAL_STEPS = 5;

const JOURNEY_OPTIONS = [
  "Still figuring out my brand",
  "I have designs, no products yet",
  "I'm selling and ready to scale",
  "Established brand, looking to optimize",
];

const GOAL_OPTIONS = [
  "Design something new",
  "Create product photography",
  "Prepare for manufacturing",
  "Plan content and launch",
  "Get inspired by other founders",
  "Set my pricing",
];

function storageKey(userId: string) {
  return `wackbehavior_onboarded_${userId}`;
}

export default function Onboarding({
  userId,
  onGenerateSketch,
}: {
  userId: string;
  onGenerateSketch?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [journey, setJourney] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);

  // Show once per user — check localStorage on mount.
  useEffect(() => {
    if (!userId) return;
    try {
      if (!localStorage.getItem(storageKey(userId))) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, [userId]);

  function finish() {
    try {
      localStorage.setItem(
        storageKey(userId),
        JSON.stringify({ journey, goal, completedAt: Date.now() })
      );
    } catch {
      /* ignore storage errors */
    }
    setOpen(false);
  }

  function handleGenerate() {
    finish();
    onGenerateSketch?.();
  }

  if (!open) return null;

  const canContinue =
    (step === 1 && journey !== null) || (step === 2 && goal !== null);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.card}>
        <div className={styles.topRow}>
          <span className={styles.stepCount}>
            {step + 1} / {TOTAL_STEPS}
          </span>
          <button className={styles.skip} onClick={finish}>
            Skip
          </button>
        </div>

        <div className={styles.dots}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i === step ? styles.dotActive : ""}`}
            />
          ))}
        </div>

        {/* STEP 0 — Welcome */}
        {step === 0 && (
          <div className={styles.body}>
            <h2 className={styles.title}>Welcome to Wackbehavior</h2>
            <p className={styles.text}>
              Design, visualize, and launch your collection. No samples. No
              photographers. No team.
            </p>
            <p className={styles.muted}>Built for founders who move fast.</p>
            <div className={styles.footer}>
              <span />
              <button className={styles.primary} onClick={() => setStep(1)}>
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* STEP 1 — Journey */}
        {step === 1 && (
          <div className={styles.body}>
            <h2 className={styles.title}>Where are you in your journey?</h2>
            <p className={styles.text}>
              This helps us tailor Wackbehavior to what you actually need right
              now.
            </p>
            <div className={styles.optionsGrid}>
              {JOURNEY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`${styles.option} ${
                    journey === opt ? styles.optionSelected : ""
                  }`}
                  onClick={() => setJourney(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className={styles.footer}>
              <button className={styles.back} onClick={() => setStep(0)}>
                ← Back
              </button>
              <button
                className={styles.primary}
                disabled={!canContinue}
                onClick={() => setStep(2)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Create first */}
        {step === 2 && (
          <div className={styles.body}>
            <h2 className={styles.title}>What do you want to create first?</h2>
            <p className={styles.text}>
              We&apos;ll drop you right where you need to be.
            </p>
            <div className={styles.optionsGrid}>
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  className={`${styles.option} ${
                    goal === opt ? styles.optionSelected : ""
                  }`}
                  onClick={() => setGoal(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className={styles.footer}>
              <button className={styles.back} onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className={styles.primary}
                disabled={!canContinue}
                onClick={() => setStep(3)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Sketch Studio explainer */}
        {step === 3 && (
          <div className={styles.body}>
            <h2 className={styles.title}>You&apos;re closer than you think.</h2>
            <p className={styles.text}>
              Sketch Studio turns your idea into a front and back design in under
              a minute. Describe what you want or upload a reference, and
              Wackbehavior builds it.
            </p>
            <div className={styles.footer}>
              <button className={styles.back} onClick={() => setStep(2)}>
                ← Back
              </button>
              <button className={styles.primary} onClick={() => setStep(4)}>
                Show Me How
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Final CTA */}
        {step === 4 && (
          <div className={styles.body}>
            <h2 className={styles.title}>You&apos;ve got 8 credits. Let&apos;s use one.</h2>
            <p className={styles.text}>Skip the dashboard. Start where it counts.</p>
            <button className={styles.primaryWide} onClick={handleGenerate}>
              Generate Your First Sketch
            </button>
            <p className={styles.fineprint}>No card required during trial.</p>
            <div className={styles.footer}>
              <button className={styles.back} onClick={() => setStep(3)}>
                ← Back
              </button>
              <span />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
