"use client";
import { useState } from "react";
import styles from "./page.module.css";

const PLANS = {
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

const FAQS = [
  {
    q: "Do I own the images I create?",
    a: "Yes. You own 100% of every design you generate in Wackbehavior. Always. No exceptions.",
  },
  {
    q: "Do credits roll over each month?",
    a: "Credits do not roll over month to month. Unused credits expire at the end of each billing cycle.",
  },
  {
    q: "What if I don't love the first output?",
    a: "Regenerate. Refine the prompt. Use a reference image. You have full creative control over every generation.",
  },
  {
    q: "Does it work for streetwear, swim, plus size, and other womenswear categories?",
    a: "Yes. Wackbehavior is built for all fashion categories — streetwear, swim, intimates, plus size, activewear, and more.",
  },
  {
    q: "Can I upload my own model or my own brand reference?",
    a: "You can upload mood board images and brand references to guide lighting, camera angle, and composition. Custom model upload is on the roadmap.",
  },
  {
    q: "How is this different from ChatGPT or Midjourney?",
    a: "Wackbehavior is purpose-built for fashion. It understands garment construction, fabric drape, technical flats, and e-commerce requirements. General AI tools require extensive prompting to get anywhere close — and still miss the mark on garment accuracy.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from your account settings. No lock-in, no cancellation fees.",
  },
  {
    q: "What happens if my payment fails?",
    a: "Your account is paused until payment is resolved. We send email reminders so you don't lose access unexpectedly.",
  },
];

export default function Home() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const plans = PLANS[billing];

  return (
    <div className={styles.page}>
      {/* NAV */}
      <nav className={styles.nav}>
        <a href="/" className={styles.navLogo}>
          <span className={styles.navLogoMark}>W</span>
          <span className={styles.navLogoText}>WACKBEHAVIOR</span>
        </a>
        <div className={styles.navCenter}>
          <span className={styles.liveOffer}>
            <span className={styles.liveDot} />
            Live offer&nbsp;&nbsp;06:21
          </span>
        </div>
        <div className={styles.navRight}>
          <a href="#community" className={styles.navLink}>
            <span className={styles.globeIcon}>🌐</span> Community
          </a>
          <a href="#signin" className={styles.navLink}>Sign in</a>
          <a href="#start" className={styles.navCta}>Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <p className={styles.heroEyebrow}>WACKBEHAVIOR</p>
          <h1 className={styles.heroHeadline}>
            The AI design<br />studio for<br />fashion{" "}
            <em>founders.</em>
          </h1>
          <p className={styles.heroSub}>
            Turn your ideas into sketches, product photos, and campaign imagery
            before your samples arrive. Built by a fashion founder, for fashion
            founders.
          </p>
          <div className={styles.heroActions}>
            <a href="#start" className={styles.btnPrimary}>
              Start Free &nbsp;→
            </a>
            <p className={styles.heroNote}>8 credits, no card required</p>
          </div>
          <a href="#gallery" className={styles.heroGalleryLink}>
            See what creators are making →
          </a>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroImagePlaceholder}>
            <p className={styles.heroImagePlaceholderText}>
              Campaign imagery will appear here
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.section} id="reviews">
        <h2 className={styles.sectionTitle}>What Founders Are Saying</h2>
        <div className={styles.testimonialGrid}>
          {[
            {
              name: "Maya Okonkwo",
              location: "Los Angeles, CA",
              quote:
                "I launched my first drop with zero photoshoot budget. Wackbehavior generated my entire lookbook in two days and it sold out before my samples even arrived. I genuinely don't know how I would have launched without it.",
            },
            {
              name: "Sofia Reyes",
              location: "Miami, FL",
              quote:
                "I quoted $3,200 for a photoshoot. Wackbehavior cost me $39 and the imagery looked better than half the brands I follow. I'm not going back.",
            },
            {
              name: "Jada Bennett",
              location: "New York, NY",
              quote:
                "What I love is that it actually understands fashion. I'd given up on AI tools because they always made garments look like Halloween costumes. Wackbehavior gets fabric weight, drape, structure. It feels made by someone who actually designs.",
            },
            {
              name: "Priya Anand",
              location: "London, UK",
              quote:
                "I use it every single day. Sketches in the morning, campaign images at night. It replaced three different tools I was paying for.",
            },
          ].map((t) => (
            <div key={t.name} className={styles.testimonialCard}>
              <p className={styles.testimonialQuote}>"{t.quote}"</p>
              <p className={styles.testimonialAuthor}>
                {t.name} · <span className={styles.testimonialLocation}>{t.location}</span>
              </p>
            </div>
          ))}
        </div>
        <a href="#reviews" className={styles.linkArrow}>
          Read more reviews →
        </a>
      </section>

      {/* GALLERY CALLOUT */}
      <section className={styles.galleryCta} id="gallery">
        <div className={styles.galleryCtaInner}>
          <h2 className={styles.gallerySectionTitle}>From sketch to campaign.</h2>
          <p className={styles.galleryDesc}>
            Real designs created in Wackbehavior. Sketches on the left, finished
            e-commerce imagery on the right.
          </p>
          <div className={styles.galleryPlaceholder}>
            <p className={styles.galleryPlaceholderText}>
              Design gallery — your generated assets will appear here
            </p>
          </div>
          <p className={styles.galleryNote}>
            Every image above was created in Wackbehavior.
          </p>
        </div>
      </section>

      {/* FOR YOU */}
      <section className={styles.forYou}>
        <div className={styles.forYouInner}>
          <h2 className={styles.forYouTitle}>Built for the founder doing it all.</h2>
          <p className={styles.forYouBody}>
            You're designing the collection, running the TikTok, talking to the
            manufacturer, and answering DMs at midnight. You don't have a creative
            agency. You don't have a $5k photoshoot budget. You have ideas, and you
            have your phone. Wackbehavior is the design team, photo studio, and
            campaign agency you'd hire if you could.
          </p>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Everything Inside Wackbehavior</h2>
        <div className={styles.capGrid}>
          {[
            {
              icon: "✏️",
              title: "AI Fashion Sketches",
              desc: "Front and back flats from any garment description.",
            },
            {
              icon: "📸",
              title: "E-Commerce Studio",
              desc: "Clean, white-background product images on Wackbehavior models.",
            },
            {
              icon: "🎬",
              title: "Campaign Studio",
              desc: "Editorial campaign images with full creative direction.",
            },
            {
              icon: "🖼️",
              title: "Reference-Driven Generation",
              desc: "Upload mood images to guide camera, lighting, and composition.",
            },
            {
              icon: "👤",
              title: "Multi-Model Support",
              desc: "Choose from Wackbehavior's curated model roster for consistency.",
            },
            {
              icon: "💬",
              title: "Ask Wackbehavior",
              desc: "AI brand advisor for content, pricing, and launch strategy.",
            },
          ].map((cap) => (
            <div key={cap.title} className={styles.capCard}>
              <span className={styles.capIcon}>{cap.icon}</span>
              <h3 className={styles.capTitle}>{cap.title}</h3>
              <p className={styles.capDesc}>{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className={styles.process}>
        <div className={styles.processInner}>
          <h2 className={styles.processTitle}>Your Collection, Before It Exists</h2>
          <div className={styles.steps}>
            {[
              {
                num: "01",
                title: "Sketch the Garment",
                body: "Describe any garment in plain language, including silhouette, fabric, closures, and construction. Wackbehavior generates clean front and back fashion flats instantly, ready for your tech pack.",
              },
              {
                num: "02",
                title: "Visualize the Campaign",
                body: "Place your designs on Wackbehavior models in editorial settings. Control camera angle, lighting, environment, and creative direction before a single sample is cut.",
              },
              {
                num: "03",
                title: "Launch With Authority",
                body: "Build your lookbook, e-commerce imagery, and campaign content from day one. Pre-sell with confidence using assets that match the quality of your vision.",
              },
            ].map((step) => (
              <div key={step.num} className={styles.step}>
                <span className={styles.stepNum}>{step.num}</span>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
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
              <a
                href="#start"
                className={plan.highlighted ? styles.btnPrimary : styles.btnOutline}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
        <p className={styles.pricingNote}>
          You own 100% of every design you create. Always. Credits do not roll
          over month to month.
        </p>
      </section>

      {/* FAQ */}
      <section className={styles.section} id="faq">
        <h2 className={styles.sectionTitle}>Everything you wanted to ask.</h2>
        <div className={styles.faqList}>
          {FAQS.map((faq, i) => (
            <div key={i} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <span className={styles.faqToggle}>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <p className={styles.faqAnswer}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDER */}
      <section className={styles.founder}>
        <div className={styles.founderInner}>
          <p className={styles.founderLabel}>From the Founder</p>
          <p className={styles.founderBody}>
            I built Wackbehavior because I run my own clothing brand and got tired
            of waiting weeks for samples before I could create any marketing content.
            Every fashion founder I knew had the same problem. So I built the tool I
            needed. If you're launching a brand with limited time and budget, this is
            for you. I read every message that comes in. Reach out anytime.
          </p>
          <p className={styles.founderSig}>— Founder of Wackbehavior</p>
          <a href="mailto:hello@wackbehavior.com" className={styles.founderEmail}>
            hello@wackbehavior.com
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <p className={styles.footerLogo}>WACKBEHAVIOR</p>
            <p className={styles.footerTagline}>
              Generate campaign-ready fashion designs in minutes.
            </p>
          </div>
          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>Product</p>
            <a href="#pricing" className={styles.footerLink}>Pricing</a>
            <a href="#community" className={styles.footerLink}>Community</a>
          </div>
          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>Resources</p>
            <a href="#dashboard" className={styles.footerLink}>Dashboard</a>
            <a href="#roadmap" className={styles.footerLink}>Roadmap</a>
            <a href="#affiliate" className={styles.footerLink}>Affiliate Program</a>
          </div>
          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>Legal</p>
            <a href="#terms" className={styles.footerLink}>Terms of Service</a>
            <a href="#privacy" className={styles.footerLink}>Privacy Policy</a>
            <a href="mailto:hello@wackbehavior.com" className={styles.footerLink}>Contact</a>
            <a href="#account" className={styles.footerLink}>My Account</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerOwnership}>
            You own 100% of every design you create. Always.
          </p>
          <p className={styles.footerCopy}>© 2026 Wackbehavior. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
