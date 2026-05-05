import "@mittwald/flow-react-components/all.css";
import "./global.scss";
import type { Metadata } from "next";
import { type FC, type PropsWithChildren } from "react";
import clsx from "clsx";
import styles from "./layout.module.scss";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import MainNavigation from "@/app/_components/layout/MainNavigation";
import { Matomo } from "@/app/_components/Matomo";
import { RouterProvider } from "@mittwald/flow-react-components/nextjs";
import Header from "@/app/_components/layout/Header";
import ScrollToHash from "@/app/_components/ScrollToHash";
import Footer from "@/app/_components/layout/Footer";
import { ThemeProvider } from "next-themes";
import { NotificationProvider } from "@mittwald/flow-react-components";
import bg from "../../public/assets/bg.svg";

export const metadata: Metadata = {
  title: "Flow – mittwald Design System",
};

const RootLayout: FC<PropsWithChildren> = async (props) => {
  const bodyClassName = clsx("flow", styles.body);

  const docs = await MdxFileFactory.fromDir("src/content");

  return (
    <html lang="de" suppressHydrationWarning>
      <body className={bodyClassName}>
        <div
          style={{ backgroundImage: `url(${bg.src})` }}
          className={styles.background}
        />
        <ThemeProvider attribute="data-flow-theme" disableTransitionOnChange>
          <RouterProvider>
            <ScrollToHash />
            <Matomo />
            <NotificationProvider>
              <div className={styles.wrapper}>
                <Header docs={docs.map((mdx) => mdx.serialize())} />
                <div className={styles.mainWrapper}>
                  <MainNavigation docs={docs.map((mdx) => mdx.serialize())} />

                  <main className={styles.main}>{props.children}</main>
                </div>
                <Footer />
              </div>
            </NotificationProvider>
          </RouterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
