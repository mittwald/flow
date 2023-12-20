import "@mittwald/flow-stylesheet";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation/Navigation";
import React from "react";
import styles from "./layout.module.css";
import clsx from "clsx";
import { useServerGetComponentModules } from "@/components/Navigation/lib/useServerGetComponentModules";

const inter = Inter({ subsets: ["latin"], weight: "300" });
export const metadata: Metadata = {
  title: "mittwald Flow - The mittwald Design System",
  description: "Collection of mittwald components and design decisions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const modules = useServerGetComponentModules();

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/vnd.microsoft.icon" href="favicon.ico" />
      </head>
      <body className={clsx(inter.className, styles.root)}>
        <div className={styles.layout}>
          <Navigation modules={modules} className={styles.menu} />
          <div className={styles.content}>{children}</div>
        </div>
      </body>
    </html>
  );
}
