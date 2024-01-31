import "./global.css";
import "./layout.module.scss";
import type { Metadata } from "next";
import React, { FC, PropsWithChildren } from "react";
import MainNavigation from "@/app/_components/layout/MainNavigation/MainNavigation";
import clsx from "clsx";
import styles from "./layout.module.scss";
import Heading from "@mittwald/flow-next-components/Heading";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";

export const metadata: Metadata = {
  title: "Flow – mittwald Design System",
};

const RootLayout: FC<PropsWithChildren> = async (props) => {
  const bodyClassName = clsx("flow", styles.body);
  const docs = await MdxFileFactory.fromDir("src/content");

  return (
    <html lang="en">
      <body className={bodyClassName}>
        <div className={styles.center}>
          <Heading level={1} className={styles.header}>
            Flow – mittwald Design System
          </Heading>
          <div className={styles.nav}>
            <MainNavigation docs={docs.map((mdx) => mdx.serialize())} />
          </div>
          <main className={styles.main}>{props.children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
