import "@mittwald/flow-react-components/styles";
import "./global.scss";
import "./layout.module.scss";
import type { Metadata } from "next";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import HeaderNavigation from "@/app/_components/layout/HeaderNavigation/HeaderNavigation";
import clsx from "clsx";
import styles from "./layout.module.scss";
import Heading from "@mittwald/flow-react-components/Heading";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import { LinkProvider } from "@mittwald/flow-react-components/nextjs";
import { IconMittwald } from "@mittwald/flow-react-components/Icons";
import MainNavigation from "@/app/_components/layout/MainNavigation";
import MobileNavigation from "@/app/_components/layout/MobileNavigation/MobileNavigation";
import { NotificationProvider } from "@mittwald/flow-react-components/NotificationProvider";

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
          <NotificationProvider>
            <header className={styles.header}>
              <IconMittwald size="l" className={styles.logo} />
              <Heading level={1} className={styles.heading}>
                Flow
              </Heading>

              <HeaderNavigation
                className={styles.headerNavigation}
                docs={docs.map((mdx) => mdx.serialize())}
              />
              <MobileNavigation
                docs={docs.map((mdx) => mdx.serialize())}
                className={styles.mobileNavigation}
              />
            </header>
            <div className={styles.center}>
              <LayoutCard className={styles.mainNavigation}>
                <MainNavigation docs={docs.map((mdx) => mdx.serialize())} />
              </LayoutCard>
              <main className={styles.main}>{props.children}</main>
            </div>
          </NotificationProvider>
        </LinkProvider>
      </body>
    </html>
  );
};

export default RootLayout;
