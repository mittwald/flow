import "@mittwald/flow-react-components/styles";
import "./global.scss";
import "./layout.module.scss";
import type { Metadata } from "next";
import React, { FC, PropsWithChildren } from "react";
import MainNavigation from "@/app/_components/layout/MainNavigation/MainNavigation";
import clsx from "clsx";
import styles from "./layout.module.scss";
import Heading from "@mittwald/flow-react-components/Heading";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import Badge from "@mittwald/flow-react-components/Badge";

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
          <Heading level={4} className={styles.heading}>
            Flow – mittwald Design System <Badge variant="warning">beta</Badge>
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
