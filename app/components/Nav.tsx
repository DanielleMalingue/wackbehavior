import Link from "next/link";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <span className={styles.logoMark}>W</span>
        <span className={styles.logoText}>WACKBEHAVIOR</span>
      </Link>
      <div className={styles.right}>
        <Link href="/pricing" className={styles.link}>Pricing</Link>
        <Link href="/signin" className={styles.link}>Sign in</Link>
        <Link href="/signup" className={styles.cta}>Get Started</Link>
      </div>
    </nav>
  );
}
