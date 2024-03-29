import "@mittwald/flow-react-components/styles";
import "./global.scss";
import "./layout.module.scss";
import type { Metadata } from "next";
import React, { FC, PropsWithChildren } from "react";
import MainNavigation from "@/app/_components/layout/MainNavigation/MainNavigation";
import HeaderNavigation from "@/app/_components/layout/HeaderNavigation/HeaderNavigation";
import clsx from "clsx";
import styles from "./layout.module.scss";
import Heading from "@mittwald/flow-react-components/Heading";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import StatusBadge from "@mittwald/flow-react-components/StatusBadge";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import LinkProvider from "@mittwald/flow-react-components/nextjs/LinkProvider";

export const metadata: Metadata = {
  title: "Flow – mittwald Design System",
};

const RootLayout: FC<PropsWithChildren> = async (props) => {
  const bodyClassName = clsx("flow", styles.body);
  const docs = await MdxFileFactory.fromDir("src/content");

  return (
    <html lang="en">
      <body className={bodyClassName}>
        <LinkProvider>
          <header className={styles.header}>
            <Heading level={1} className={styles.heading}>
              Flow – mittwald Design System{" "}
              <StatusBadge className={styles.betaBadge} status="warning">
                beta
              </StatusBadge>
            </Heading>
            <HeaderNavigation docs={docs.map((mdx) => mdx.serialize())} />
          </header>
          <div className={styles.center}>
            <LayoutCard className={styles.nav}>
              <MainNavigation docs={docs.map((mdx) => mdx.serialize())} />
            </LayoutCard>
            <LayoutCard elementType="main" className={styles.main}>
              {props.children}
            </LayoutCard>
          </div>
        </LinkProvider>
      </body>
    </html>
  );
};

export default RootLayout;
