"use client";
import {
  HeaderNavigation,
  Heading,
  IllustratedMessage,
  Link,
  LoadingSpinner,
  Notification,
  NotificationProvider,
  Render,
  Separator,
  Text,
  useNotificationController,
} from "@mittwald/flow-react-components";
import "@mittwald/flow-react-components/all.css";
import { RouterProvider } from "@mittwald/flow-react-components/nextjs";
import type { ErrorComponent } from "next/dist/client/components/error-boundary";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { type PropsWithChildren, Suspense } from "react";
import styles from "./layout.module.css";
import { TunnelExit } from "@mittwald/react-tunnel";

const Error: ErrorComponent = (props) => {
  return <>REMOTE RENDER ERROR: {props.error.message}</>;
};

export default function Layout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <RouterProvider>
          <NotificationProvider>
            <div className={styles.rootContainer}>
              <HeaderNavigation>
                <Link href="/host/non-interactive">Non-interactive</Link>
                <Link href="/host/event-handler">Event handler</Link>
                <Link href="/host/context-menu">Context Menu</Link>
                <Link href="/host/popover">Popover</Link>
                <Link href="/host/modal">Modal</Link>
                <Link href="/host/notification">Notifications</Link>
                <Render>
                  {() => {
                    const notifications = useNotificationController();
                    return (
                      <Link
                        onPress={() =>
                          notifications.add(
                            <Notification>
                              <Text>Host notification</Text>
                            </Notification>,
                          )
                        }
                      >
                        Host notification
                      </Link>
                    );
                  }}
                </Render>
                <Link href="/host/overlay-controller">Overlay controller</Link>
                <Link href="/host/simple-form">Simple Form</Link>
                <Link href="/host/action-form">Action Form</Link>
                <Link href="/host/react-hook-form">React Hook Form</Link>
                <Link href="/host/rhf-form">RHF Form</Link>
                <Link href="/host/suspense">Suspense</Link>
                <Link href="/host/tunnel">Tunnel</Link>
                <Link href="/host/ext-bridge">Ext Bridge</Link>
                <Link href="/host/error">Error</Link>
                <Link href="/host/svg">Icon/SVG</Link>
                <Link href="/host/list">List</Link>
                <Link href="/host/navigation">Navigation</Link>
                <Link href="/host/performance">Performance</Link>
                <TunnelExit id="remote-demo" />
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
          </NotificationProvider>
        </RouterProvider>
      </body>
    </html>
  );
}
