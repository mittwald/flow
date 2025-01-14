import "@mittwald/flow-react-components/all.css";
import "./global.scss";
import "./layout.module.scss";
import type { Metadata } from "next";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import HeaderNavigation from "~/app/_components/layout/HeaderNavigation/HeaderNavigation";
import clsx from "clsx";
import styles from "./layout.module.scss";
import { MdxFileFactory } from "~/lib/mdx/MdxFileFactory";
import { LinkProvider } from "@mittwald/flow-react-components/nextjs";
import logoMittwald from "../../assets/m-flow_logo.svg";
import MainNavigation from "~/app/_components/layout/MainNavigation";
import MobileNavigation from "~/app/_components/layout/MobileNavigation/MobileNavigation";
import { NotificationProvider } from "@mittwald/flow-react-components/NotificationProvider";
import { Link } from "@mittwald/flow-react-components/Link";
import { Image } from "@mittwald/flow-react-components/Image";
import Footer from "~/app/_components/layout/Footer/Footer";

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
              <Link href="/" className={styles.homeLink}>
                <Image src={logoMittwald.src} alt="mittwald Flow Logo" />
              </Link>
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
              <MainNavigation docs={docs.map((mdx) => mdx.serialize())} />
              <main className={styles.main}>{props.children}</main>
            </div>
            <Footer />
          </NotificationProvider>
        </LinkProvider>
      </body>
    </html>
  );
};

export default RootLayout;
