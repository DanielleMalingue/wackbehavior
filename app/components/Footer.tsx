"use client";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.logo}>WACKBEHAVIOR</p>
          <p className={styles.tagline}>
            Generate campaign-ready fashion designs in minutes.
          </p>
        </div>
        <div className={styles.col}>
          <p className={styles.colTitle}>Product</p>
          <Link href="/dashboard/plans" className={styles.link}>Pricing</Link>
          <a href="/#community" className={styles.link}>Community</a>
        </div>
        <div className={styles.col}>
          <p className={styles.colTitle}>Resources</p>
          <Link href="/dashboard" className={styles.link}>Dashboard</Link>
          <a href="/#roadmap" className={styles.link}>Roadmap</a>
          <a href="/#affiliate" className={styles.link}>Affiliate Program</a>
        </div>
        <div className={styles.col}>
          <p className={styles.colTitle}>Legal</p>
          <Link href="/terms" className={styles.link}>Terms of Service</Link>
          <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
          <a href="mailto:hello@wackbehavior.com" className={styles.link}>Contact</a>
          <Link href="/dashboard/plans" className={styles.link}>My Account</Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <p className={styles.copy}>© 2026 Wackbehavior. All rights reserved.</p>
      </div>
    </footer>
  );
}
