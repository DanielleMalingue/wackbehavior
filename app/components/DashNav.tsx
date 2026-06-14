"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import styles from "./DashNav.module.css";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/create", label: "Create" },
  { href: "/dashboard/photo", label: "Photo Studio" },
  { href: "/dashboard/plans", label: "Plans" },
];

export default function DashNav({ credits = 8 }: { credits?: number }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut(getFirebaseAuth());
    router.push("/");
  }

  return (
    <nav className={styles.nav}>
      <Link href="/dashboard" className={styles.logo}>
        WACKBEHAVIOR
      </Link>
      <div className={styles.links}>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`${styles.link} ${pathname === l.href ? styles.linkActive : ""}`}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div className={styles.right}>
        <span className={styles.credits}>⚡ {credits}</span>
        <button className={styles.signOut} onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </nav>
  );
}
