import "@mittwald/flow-react-components/all-layered.css";
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
import Footer from "@/app/_components/layout/Footer";
import type { ThemeProviderProps } from "@teispace/next-themes";
import { ThemeProvider } from "@teispace/next-themes";
import { getTheme, getThemeScript } from "@teispace/next-themes/server";
import { NotificationProvider } from "@mittwald/flow-react-components";
import Script from "next/script";
import { componentGroupingScript } from "@/app/_lib/componentGrouping";

export const metadata: Metadata = {
  title: "Flow – mittwald Design System",
};

const RootLayout: FC<PropsWithChildren> = async (props) => {
  const bodyClassName = clsx("flow", styles.body);
  const initialTheme = await getTheme();
  const docs = await MdxFileFactory.fromDir("src/content");

  const themeProps: Partial<
    Omit<ThemeProviderProps, "disableTransitionOnChange">
  > = {
    attribute: "data-theme",
    defaultTheme: "system",
    enableSystem: true,
    initialTheme: initialTheme ?? undefined,
  };

  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {getThemeScript(themeProps)}
        </Script>
        <script
          id="component-grouping-init"
          dangerouslySetInnerHTML={{ __html: componentGroupingScript }}
        />
      </head>
      <body className={bodyClassName}>
        <div className={styles.background} />
        <ThemeProvider {...themeProps} disableTransitionOnChange noScript>
          <RouterProvider>
            <Matomo />
            <NotificationProvider>
              <div className={styles.wrapper}>
                <Header docs={docs.map((mdx) => mdx.serialize())} />
                <div className={styles.mainWrapper}>
                  <MainNavigation docs={docs.map((mdx) => mdx.serialize())} />

                  <main className={styles.main} id="main-content" tabIndex={-1}>
                    {props.children}
                  </main>
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
