"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./PricingSection.module.css";

type Plan = {
  name: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge: string | null;
};

const PLANS: Record<"monthly" | "annual", Plan[]> = {
  monthly: [
    {
      name: "Free Trial",
      price: "Free",
      priceNote: "No credit card required",
      description: "Try Wackbehavior with no commitment.",
      features: [
        "8 credits to start",
        "Access to Sketch Studio",
        "Front & back garment images",
      ],
      cta: "Start Free",
      highlighted: false,
      badge: null,
    },
    {
      name: "Basic",
      price: "$19",
      priceNote: "/ mo · Billed monthly",
      description: "Best for testing your first garment end to end.",
      features: [
        "40 credits per month",
        "Front & back garment images",
        "High-resolution exports",
        "Sketch Studio access",
      ],
      cta: "Start Basic",
      highlighted: false,
      badge: null,
    },
    {
      name: "Pro",
      price: "$55",
      priceNote: "/ mo · Billed monthly",
      description: "Best for active creators shipping monthly drops of 3–5 garments.",
      features: [
        "250 credits per month",
        "Front & back garment images",
        "Campaign Studio access",
        "High-resolution exports",
        "Priority rendering queue",
      ],
      cta: "Start Pro",
      highlighted: true,
      badge: "Most popular",
    },
    {
      name: "Studio",
      price: "$79",
      priceNote: "/ mo · Billed monthly",
      description: "Best for growing brands designing 10+ garments per month.",
      features: [
        "500 credits per month",
        "Faster generation queue",
        "Campaign Studio access",
        "High-resolution exports",
        "Priority support",
      ],
      cta: "Start Studio",
      highlighted: false,
      badge: "Recommended",
    },
    {
      name: "Agency",
      price: "$199",
      priceNote: "/ mo · Billed monthly",
      description:
        "Best for agencies and heavy creators managing multiple brands or weekly drops.",
      features: [
        "1500 credits per month",
        "Fastest generation queue",
        "Campaign Studio access",
        "Priority support",
        "Early access to new Wackbehavior tools",
      ],
      cta: "Start Agency",
      highlighted: false,
      badge: null,
    },
  ],
  annual: [
    {
      name: "Free Trial",
      price: "Free",
      priceNote: "No credit card required",
      description: "Try Wackbehavior with no commitment.",
      features: [
        "8 credits to start",
        "Access to Sketch Studio",
        "Front & back garment images",
      ],
      cta: "Start Free",
      highlighted: false,
      badge: null,
    },
    {
      name: "Basic",
      price: "$15",
      priceNote: "/ mo · Billed annually",
      description: "Best for testing your first garment end to end.",
      features: [
        "40 credits per month",
        "Front & back garment images",
        "High-resolution exports",
        "Sketch Studio access",
      ],
      cta: "Start Basic",
      highlighted: false,
      badge: null,
    },
    {
      name: "Pro",
      price: "$44",
      priceNote: "/ mo · Billed annually",
      description: "Best for active creators shipping monthly drops of 3–5 garments.",
      features: [
        "250 credits per month",
        "Front & back garment images",
        "Campaign Studio access",
        "High-resolution exports",
        "Priority rendering queue",
      ],
      cta: "Start Pro",
      highlighted: true,
      badge: "Most popular",
    },
    {
      name: "Studio",
      price: "$63",
      priceNote: "/ mo · Billed annually",
      description: "Best for growing brands designing 10+ garments per month.",
      features: [
        "500 credits per month",
        "Faster generation queue",
        "Campaign Studio access",
        "High-resolution exports",
        "Priority support",
      ],
      cta: "Start Studio",
      highlighted: false,
      badge: "Recommended",
    },
    {
      name: "Agency",
      price: "$159",
      priceNote: "/ mo · Billed annually",
      description:
        "Best for agencies and heavy creators managing multiple brands or weekly drops.",
      features: [
        "1500 credits per month",
        "Fastest generation queue",
        "Campaign Studio access",
        "Priority support",
        "Early access to new Wackbehavior tools",
      ],
      cta: "Start Agency",
      highlighted: false,
      badge: null,
    },
  ],
};

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const plans = PLANS[billing];

  return (
    <section className={styles.section} id="pricing">
      <h2 className={styles.sectionTitle}>Designed for how you create</h2>
      <p className={styles.pricingSubtext}>
        Credits renew monthly. Pay monthly or save 20% annually.
      </p>
      <div className={styles.billingToggle}>
        <button
          className={`${styles.billingBtn} ${billing === "monthly" ? styles.billingBtnActive : ""}`}
          onClick={() => setBilling("monthly")}
        >
          Monthly
        </button>
        <button
          className={`${styles.billingBtn} ${billing === "annual" ? styles.billingBtnActive : ""}`}
          onClick={() => setBilling("annual")}
        >
          Annual <span className={styles.saveBadge}>Save 20%</span>
        </button>
      </div>
      <div className={styles.pricingGrid}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`${styles.pricingCard} ${plan.highlighted ? styles.pricingCardHighlighted : ""}`}
          >
            {plan.badge && (
              <span className={styles.pricingBadge}>{plan.badge}</span>
            )}
            <h3 className={styles.planName}>{plan.name}</h3>
            <p className={styles.planPrice}>
              {plan.price}
              {plan.price !== "Free" && <span className={styles.planPriceNote}>{plan.priceNote}</span>}
            </p>
            {plan.price === "Free" && (
              <p className={styles.planFreeNote}>{plan.priceNote}</p>
            )}
            <p className={styles.planDesc}>{plan.description}</p>
            <ul className={styles.planFeatures}>
              {plan.features.map((f) => (
                <li key={f} className={styles.planFeature}>
                  <span className={styles.checkmark}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={plan.highlighted ? styles.btnPrimary : styles.btnOutline}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
      <p className={styles.pricingNote}>
        You own 100% of every design you create. Always. Credits do not roll
        over month to month.
      </p>
    </section>
  );
}
