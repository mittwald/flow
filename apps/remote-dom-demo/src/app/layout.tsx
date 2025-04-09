"use client";
import {
  HeaderNavigation,
  Heading,
  IllustratedMessage,
  Link,
  LoadingSpinner,
  Separator,
} from "@mittwald/flow-react-components";
import "@mittwald/flow-react-components/all.css";
import { LinkProvider } from "@mittwald/flow-react-components/nextjs";
import type { ErrorComponent } from "next/dist/client/components/error-boundary";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { type PropsWithChildren, Suspense } from "react";
import styles from "./layout.module.css";

const Error: ErrorComponent = (props) => {
  return <>REMOTE RENDER ERROR: {props.error.message}</>;
};

export default function Layout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <LinkProvider>
          <div className={styles.rootContainer}>
            <HeaderNavigation>
              <Link href="/host/non-interactive">Non-interactive</Link>
              <Link href="/host/event-handler">Event handler</Link>
              <Link href="/host/context-menu">Context Menu</Link>
              <Link href="/host/popover">Popover</Link>
              <Link href="/host/modal">Modal</Link>
              <Link href="/host/overlay-controller">Overlay controller</Link>
              <Link href="/host/simple-form">Simple Form</Link>
              <Link href="/host/action-form">Action Form</Link>
              <Link href="/host/react-hook-form">React Hook Form</Link>
              <Link href="/host/rhf-form">RHF Form</Link>
              <Link href="/host/suspense">Suspense</Link>
              <Link href="/host/ext-bridge">Ext Bridge</Link>
              <Link href="/host/error">Error</Link>
              <Link href="/host/svg">Icon/SVG</Link>
              <Link href="/host/list">List</Link>
              <Link href="/host/navigation/page1">Navigation</Link>
              <Link href="/host/performance">Performance</Link>
            </HeaderNavigation>
            <Separator />
            <main>
              <div>
                <ErrorBoundary errorComponent={Error}>
                  <Suspense
                    fallback={
                      <IllustratedMessage>
                        <LoadingSpinner />
                        <Heading>Lade Demo</Heading>
                      </IllustratedMessage>
                    }
                  >
                    {props.children}
                  </Suspense>
                </ErrorBoundary>
              </div>
            </main>
          </div>
        </LinkProvider>
      </body>
    </html>
  );
}
