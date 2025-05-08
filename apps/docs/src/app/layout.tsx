import "@mittwald/flow-react-components/all.css";
import "./global.scss";
import type { Metadata } from "next";
import { type FC, type PropsWithChildren } from "react";
import HeaderNavigation from "@/app/_components/layout/HeaderNavigation/HeaderNavigation";
import clsx from "clsx";
import styles from "./layout.module.scss";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import logoMittwald from "../../assets/m-flow_logo.svg";
import MainNavigation from "@/app/_components/layout/MainNavigation";
import MobileNavigation from "@/app/_components/layout/MobileNavigation/MobileNavigation";
import {
  Image,
  Link,
  NotificationProvider,
} from "@mittwald/flow-react-components";
import Footer from "@/app/_components/layout/Footer/Footer";
import { Matomo } from "@/app/_components/Matomo";
import { RouterProvider } from "@mittwald/flow-react-components/nextjs";

export const metadata: Metadata = {
  title: "Flow – mittwald Design System",
};

const RootLayout: FC<PropsWithChildren> = async (props) => {
  const bodyClassName = clsx("flow", styles.body);
  const docs = await MdxFileFactory.fromDir("src/content");

  return (
    <html lang="de">
      <body className={bodyClassName}>
        <RouterProvider>
          <Matomo />
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
        </RouterProvider>
      </body>
    </html>
  );
};

export default RootLayout;
