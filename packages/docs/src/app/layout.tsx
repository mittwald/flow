import "./global.css";
import "./layout.module.scss";
import type { Metadata } from "next";
import React, { FC, PropsWithChildren } from "react";
import MainNavigation from "@/components/layout/MainNavigation/MainNavigation";
import clsx from "clsx";
import styles from "./layout.module.scss";
import Heading from "@mittwald/flow-next-components/Heading";

export const metadata: Metadata = {
  title: "Flow – mittwald Design System",
};

const RootLayout: FC<PropsWithChildren> = (props) => {
  const rootClassName = clsx("flow", styles.root);

  return (
    <html lang="en">
      <body className={rootClassName}>
        <Heading level={1} className={styles.header}>
          Flow – mittwald Design System
        </Heading>
        <div className={styles.nav}>
          <MainNavigation />
        </div>
        <main className={styles.main}>{props.children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
