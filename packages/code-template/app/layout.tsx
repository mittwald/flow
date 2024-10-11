import type { Metadata } from "next";
import "./globals.scss";
import "@mittwald/flow-react-components/styles";
import type { ReactNode } from "react";
import styles from "./layout.module.scss";
import { IconMittwald } from "@mittwald/flow-react-components/Icons";
import { HeaderNavigation } from "@/app/_components/HeaderNavigation";

export const metadata: Metadata = {
  title: "Code template",
  description: "mittwald code template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <div className={styles.container}>
          <header className={styles.header}>
            <IconMittwald color="light" size="l" />
            <HeaderNavigation />
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
