import "@mittwald/flow-react-components/all-layered.css";
import "../global.scss";
import { type FC, type PropsWithChildren } from "react";
import clsx from "clsx";
import styles from "./layout.module.scss";
import { RouterProvider } from "@mittwald/flow-react-components/nextjs";
import type { ThemeProviderProps } from "@teispace/next-themes";
import { ThemeProvider } from "@teispace/next-themes";
import { getTheme, getThemeScript } from "@teispace/next-themes/server";
import Script from "next/script";

/**
 * Second root layout, for the pages that show an App Shell on its own.
 *
 * It carries the theme and the Flow stylesheet, and nothing else: the shell
 * _is_ the page, so the Styleguide's own header, navigation and footer would
 * contradict what the page demonstrates. The docs chrome lives in the sibling
 * `(docs)` root layout.
 */
const PreviewLayout: FC<PropsWithChildren> = async (props) => {
  const initialTheme = await getTheme();

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
      </head>
      <body className={clsx("flow", styles.body)}>
        <ThemeProvider {...themeProps} disableTransitionOnChange noScript>
          <RouterProvider>{props.children}</RouterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default PreviewLayout;
