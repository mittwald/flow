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
import { RemoteRoot } from "@mittwald/flow-remote-react-components/RemoteRoot";
import type { ErrorComponent } from "next/dist/client/components/error-boundary";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { usePathname } from "next/navigation";
import { type PropsWithChildren, Suspense } from "react";
import styles from "./layout.module.css";

const Error: ErrorComponent = (props) => {
  return <>REMOTE RENDER ERROR: {props.error.message}</>;
};

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
              <Link href="/ext-bridge">Ext Bridge</Link>
              <Link href="/error">Error</Link>
              <Link href="/svg">Icon/SVG</Link>
              <Link href="/list">List</Link>
              <Link href="/performance">Performance</Link>
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
                    <RemoteRoot
                      key={p}
                      showPreview
                      extBridgeImplementation={{
                        getConfig: async () => ({
                          extensionId: "ext-id",
                          extensionInstanceId: "exti-id",
                          sessionId: "session-id",
                          userId: "user-id",
                        }),
                        getSessionToken: async () => "session-token",
                      }}
                    >
                      {props.children}
                    </RemoteRoot>
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
