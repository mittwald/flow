"use client";
import "@mittwald/flow-react-components/all.css";
import type { PropsWithChildren } from "react";
import { LinkProvider } from "@mittwald/flow-react-components/nextjs";
import HeaderNavigation from "@mittwald/flow-react-components/HeaderNavigation";
import { Link } from "@mittwald/flow-react-components/Link";
import styles from "./layout.module.css";
import { Separator } from "@mittwald/flow-react-components/Separator";
import Root from "@mittwald/flow-remote-react-components/Root";
import { usePathname } from "next/navigation";

export default function Layout(props: PropsWithChildren) {
  const p = usePathname();

  return (
    <html lang="en">
      <body>
        <LinkProvider>
          <div className={styles.rootContainer}>
            <HeaderNavigation>
              <Link href="/non-interactive">Non-interactive</Link>
              <Link href="/event-handler">Event handler</Link>
              <Link href="/context-menu">Context Menu</Link>
              <Link href="/popover">Popover</Link>
              <Link href="/modal">Modal</Link>
              <Link href="/overlay-controller">Overlay controller</Link>
              <Link href="/simple-form">Simple Form</Link>
              <Link href="/action-form">Action Form</Link>
              <Link href="/react-hook-form">React Hook Form</Link>
              <Link href="/rhf-form">RHF Form</Link>
              <Link href="/suspense">Suspense</Link>
              <Link href="/svg">Icon/SVG</Link>
              <Link href="/list">List</Link>
              <Link href="/performance">Performance</Link>
            </HeaderNavigation>
            <Separator />
            <main>
              <div>
                <Root key={p} showPreview>
                  {props.children}
                </Root>
              </div>
            </main>
          </div>
        </LinkProvider>
      </body>
    </html>
  );
}
