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
import ContentBox from "@mittwald/flow-react-components/ContentBox";

export const metadata: Metadata = {
  title: "Flow – mittwald Design System",
};

const RootLayout: FC<PropsWithChildren> = async (props) => {
  const bodyClassName = clsx("flow", styles.body);
  const docs = await MdxFileFactory.fromDir("src/content");

  return (
    <html lang="en">
      <body className={bodyClassName}>
        <header className={styles.header}>
          <Heading level={1} className={styles.heading}>
            Flow – mittwald Design System <Badge variant="warning">beta</Badge>
          </Heading>
        </header>
        <div className={styles.center}>
          <ContentBox className={styles.nav}>
            <MainNavigation docs={docs.map((mdx) => mdx.serialize())} />
          </ContentBox>
          <ContentBox elementType="main" className={styles.main}>
            {props.children}
          </ContentBox>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
