"use client";
export const dynamic = "force-dynamic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import DashNav from "../../components/DashNav";
import Footer from "../../components/Footer";
import styles from "./page.module.css";

export default function Designs() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  return (
    <div className={styles.page}>
      <DashNav credits={8} />
      <main className={styles.main}>
        <h1 className={styles.title}>My Designs</h1>
        <p className={styles.subtitle}>Every sketch you generate lives here.</p>

        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🖼</div>
          <p className={styles.emptyTitle}>No designs yet</p>
          <p className={styles.emptySub}>Create your first AI fashion sketch to get started.</p>
          <button
            className={styles.createBtn}
            onClick={() => router.push("/dashboard/create")}
          >
            Create Design
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
