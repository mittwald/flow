import Image from "next/image";
import React from "react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <div>
        <div className={styles.heading}>
          mittwald Flow - The mittwald Design System
          <a
            href="https://mittwald.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/mittwald.png"
              alt="mittwald"
              width={450}
              height={190}
              priority
            />
          </a>
        </div>
        <br />
        <hr />
        <br />
        &lt;&lt; <b>Choose your component from the left menu.</b>
        <br />
        <br />
        <hr />
        <br />
        <h3>⚠️ EARLY DEVELOPMENT — STABILITY NOTICE ⚠️</h3>
        <p>
          This project is in early development stage, and we do not offer any
          stability guarantees of any kind. We welcome you to give this project
          a try and we&rsquo;re looking forward for any feedback on this project
          in this stage of development. However, please do not rely on any
          inputs or outputs of this project to remain stable.
        </p>
      </div>
    </main>
  );
}
