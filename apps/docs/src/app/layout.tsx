import "@mittwald/flow-react-components/all.css";
import "./global.scss";
import type { Metadata } from "next";
import { type FC, type PropsWithChildren } from "react";
import clsx from "clsx";
import styles from "./layout.module.scss";
import { MdxFileFactory } from "@/lib/mdx/MdxFileFactory";
import MainNavigation from "@/app/_components/layout/MainNavigation";
import { Image, NotificationProvider } from "@mittwald/flow-react-components";
import Footer from "@/app/_components/layout/Footer/Footer";
import { Matomo } from "@/app/_components/Matomo";
import { RouterProvider } from "@mittwald/flow-react-components/nextjs";
import wave from "../../assets/flow-wave.svg";
import Header from "@/app/_components/layout/Header";

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
            <Image src={wave.src} className={styles.wave} />

            <Header docs={docs.map((mdx) => mdx.serialize())} />
            <div className={styles.wrapper}>
              <MainNavigation docs={docs.map((mdx) => mdx.serialize())} />
              <div className={styles.mainWrapper}>
                <main className={styles.main}>{props.children}</main>
              </div>
            </div>
          </NotificationProvider>
        </RouterProvider>
      </body>
    </html>
  );
};

export default RootLayout;
