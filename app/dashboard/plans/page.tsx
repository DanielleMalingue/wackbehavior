"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { getFirebaseDb } from "@/lib/firestore";
import {
  checkoutSubscription,
  checkoutTopup,
  openBillingPortal,
} from "@/lib/billing-client";
import type { PlanId } from "@/lib/plans";
import DashNav from "../../components/DashNav";
import Footer from "../../components/Footer";
import styles from "./page.module.css";

type Account = {
  plan?: string;
  billing?: string;
  subscriptionStatus?: string;
  credits?: number;
};

type Plan = {
  name: string;
  monthly: number;
  annual: number;
  desc: string;
  features: string[];
  badge?: "MOST POPULAR" | "RECOMMENDED";
  highlighted?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Basic",
    monthly: 19,
    annual: 15,
    desc: "Best for testing your first garment end to end.",
    features: [
      "40 credits per month",
      "Front & back garment images",
      "High-resolution exports",
      "Sketch Studio access",
    ],
  },
  {
    name: "Pro",
    monthly: 55,
    annual: 44,
    desc: "Best for active creators shipping monthly drops of 3–5 garments.",
    features: [
      "250 credits per month",
      "Front & back garment images",
      "Campaign Studio access",
      "High-resolution exports",
      "Priority rendering queue",
    ],
    badge: "MOST POPULAR",
    highlighted: true,
  },
  {
    name: "Studio",
    monthly: 79,
    annual: 63,
    desc: "Best for growing brands designing 10+ garments per month.",
    features: [
      "500 credits per month",
      "Faster generation queue",
      "Campaign Studio access",
      "High-resolution exports",
      "Priority support",
    ],
    badge: "RECOMMENDED",
  },
  {
    name: "Agency",
    monthly: 199,
    annual: 159,
    desc: "Best for agencies and heavy creators managing multiple brands or weekly drops.",
    features: [
      "1500 credits per month",
      "Fastest generation queue",
      "Campaign Studio access",
      "Priority support",
      "Early access to new Wackbehavior tools",
    ],
  },
];

const TOPUPS = [
  { credits: 25, price: 20, per: "0.80" },
  { credits: 100, price: 60, per: "0.60", best: true },
  { credits: 300, price: 150, per: "0.50" },
];

export default function Plans() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"plans" | "topups">("plans");
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/signin");
  }, [user, loading, router]);

  // Live-read the user's billing/credit state from Firestore.
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      doc(getFirebaseDb(), "users", user.uid),
      (snap) => setAccount((snap.data() as Account) ?? {}),
      () => setAccount({}),
    );
    return () => unsub();
  }, [user]);

  // Surface the result of returning from Stripe Checkout.
  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("status");
    if (status === "success") {
      setNotice("Payment successful — your credits will update momentarily.");
    } else if (status === "cancelled") {
      setNotice("Checkout cancelled. No charge was made.");
    }
  }, []);

  if (loading || !user) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
      </div>
    );
  }

  async function handleSubscribe(plan: PlanId) {
    setNotice("");
    setBusy(`plan:${plan}`);
    try {
      await checkoutSubscription(plan, billing);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not start checkout.");
      setBusy(null);
    }
  }

  async function handleTopup(topupId: string) {
    setNotice("");
    setBusy(`topup:${topupId}`);
    try {
      await checkoutTopup(topupId);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not start checkout.");
      setBusy(null);
    }
  }

  async function handlePortal() {
    setNotice("");
    setBusy("portal");
    try {
      await openBillingPortal();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not open billing portal.");
      setBusy(null);
    }
  }

  const hasSubscription =
    account?.subscriptionStatus === "active" ||
    account?.subscriptionStatus === "trialing" ||
    account?.subscriptionStatus === "past_due";

  return (
    <div className={styles.page}>
      <DashNav />
      <main className={styles.main}>
        <h1 className={styles.title}>Plans &amp; Credits</h1>
        <p className={styles.subtitle}>Subscribe for monthly credits, or top up anytime.</p>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "plans" ? styles.tabActive : ""}`}
            onClick={() => setTab("plans")}
          >
            Plans
          </button>
          <button
            className={`${styles.tab} ${tab === "topups" ? styles.tabActive : ""}`}
            onClick={() => setTab("topups")}
          >
            Credit top-ups
          </button>
        </div>

        {/* Current plan summary */}
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Current Plan</span>
            <span className={styles.summaryValue}>
              {hasSubscription && account?.plan && account.plan !== "trial" ? (
                <>
                  Wackbehavior{" "}
                  {account.plan.charAt(0).toUpperCase() + account.plan.slice(1)}
                </>
              ) : (
                <>
                  Wackbehavior Trial <span className={styles.tagTrial}>TRIAL</span>
                </>
              )}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Available</span>
            <span className={styles.summaryBig}>{account?.credits ?? 8}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Billing</span>
            <span className={styles.summaryValue}>
              {account?.billing
                ? account.billing.charAt(0).toUpperCase() + account.billing.slice(1)
                : "—"}
            </span>
          </div>
          <div className={styles.summaryItem}>
            {hasSubscription ? (
              <button
                className={styles.upgradeOutline}
                onClick={handlePortal}
                disabled={busy === "portal"}
              >
                {busy === "portal" ? "Opening…" : "Manage subscription"}
              </button>
            ) : (
              <>
                <span className={styles.summaryLabel}>Status</span>
                <span className={styles.summaryBig}>—</span>
              </>
            )}
          </div>
        </div>
        <div className={styles.summaryRule} />

        {notice && <div className={styles.notice}>{notice}</div>}

        {tab === "plans" ? (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div>
                <h2 className={styles.sectionTitle}>Plans</h2>
                <p className={styles.sectionSub}>
                  Credits renew monthly. Save 20% with annual billing.
                </p>
              </div>
              <div className={styles.billingToggle}>
                <button
                  className={`${styles.billBtn} ${billing === "monthly" ? styles.billActive : ""}`}
                  onClick={() => setBilling("monthly")}
                >
                  Monthly
                </button>
                <button
                  className={`${styles.billBtn} ${billing === "annual" ? styles.billActive : ""}`}
                  onClick={() => setBilling("annual")}
                >
                  Annual
                </button>
                <span className={styles.saveBadge}>Save 20%</span>
              </div>
            </div>

            <p className={styles.promo}>Use code NEW24 at checkout for 25% off your first month.</p>

            <div className={styles.planGrid}>
              {PLANS.map((plan) => {
                const price = billing === "monthly" ? plan.monthly : plan.annual;
                const first = (price * 0.75).toFixed(2);
                return (
                  <div
                    key={plan.name}
                    className={`${styles.planCard} ${plan.highlighted ? styles.planHighlighted : ""}`}
                  >
                    {plan.badge && (
                      <span
                        className={`${styles.planBadge} ${
                          plan.badge === "MOST POPULAR" ? styles.badgePopular : styles.badgeRec
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}
                    <h3 className={styles.planName}>{plan.name}</h3>
                    <p className={styles.planPrice}>
                      ${price}
                      <span className={styles.planPer}>/mo</span>
                    </p>
                    <p className={styles.planBilled}>
                      Billed {billing === "monthly" ? "monthly" : "annually"}
                    </p>
                    <p className={styles.planFirst}>First month ${first} with NEW24</p>
                    <p className={styles.planDesc}>{plan.desc}</p>
                    <div className={styles.planDivider} />
                    <ul className={styles.featureList}>
                      {plan.features.map((f) => (
                        <li key={f} className={styles.feature}>
                          <span className={styles.check}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={plan.highlighted ? styles.upgradeFilled : styles.upgradeOutline}
                      onClick={() => handleSubscribe(plan.name.toLowerCase() as PlanId)}
                      disabled={busy === `plan:${plan.name.toLowerCase()}`}
                    >
                      {busy === `plan:${plan.name.toLowerCase()}`
                        ? "Redirecting…"
                        : "↑ Upgrade"}
                    </button>
                  </div>
                );
              })}
            </div>

            <p className={styles.ownNote}>
              🛡 You own 100% of every design you create. Always.
            </p>
          </section>
        ) : (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Need more credits right now?</h2>
            <p className={styles.sectionSub}>
              Top-ups never expire. Stack on top of your plan credits.
            </p>
            <div className={styles.topupGrid}>
              {TOPUPS.map((t) => (
                <div
                  key={t.credits}
                  className={`${styles.topupCard} ${t.best ? styles.topupBest : ""}`}
                >
                  {t.best && <span className={styles.topupBadge}>BEST VALUE</span>}
                  <span className={styles.topupCredits}>⚡ {t.credits} credits</span>
                  <p className={styles.topupPrice}>${t.price}</p>
                  <p className={styles.topupPer}>${t.per} per credit</p>
                  <button
                    className={styles.buyBtn}
                    onClick={() => handleTopup(String(t.credits))}
                    disabled={busy === `topup:${t.credits}`}
                  >
                    {busy === `topup:${t.credits}` ? "Redirecting…" : "Buy"}
                  </button>
                </div>
              ))}
            </div>
            <p className={styles.topupNote}>
              Top-ups are priced above plan credit rates. To get the best per-credit value, upgrade
              your plan.
            </p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
