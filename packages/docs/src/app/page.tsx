import styles from "./page.module.css";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Documentation</h1>
      <Link href="/button" className="flow-button flow-button-primary">
        Button
      </Link>
    </main>
  );
}
