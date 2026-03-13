"use client";
import {
  Flex,
  Heading,
  LayoutCard,
  Navigation,
  NavigationGroup,
  NotificationProvider,
} from "@mittwald/flow-react-components";
import "@mittwald/flow-react-components/all.css";
import { RouterProvider } from "@mittwald/flow-react-components/nextjs";
import type { ErrorComponent } from "next/dist/client/components/error-boundary";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { type PropsWithChildren, Suspense } from "react";
import styles from "./layout.module.scss";
import { TunnelExit } from "@mittwald/react-tunnel";
import { LoadingMessage } from "@/app/_components/LoadingMessage";
import { NavigationItem } from "@/app/_components/NavigationItem";

const Error: ErrorComponent = (props) => {
  return <>REMOTE RENDER ERROR: {props.error.message}</>;
};

export default function Layout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <RouterProvider>
          <NotificationProvider>
            <div className={styles.rootContainer}>
              <Heading level={1}>Remote Dom Demo</Heading>
              <Flex gap="m">
                <LayoutCard className={styles.navigation}>
                  <Navigation>
                    <NavigationItem page="non-interactive">
                      Non-interactive
                    </NavigationItem>
                    <NavigationItem page="event-handler">
                      Event handler
                    </NavigationItem>
                    <NavigationItem page="simple-form">
                      Simple Form
                    </NavigationItem>
                    <NavigationItem page="action-form">
                      Action Form
                    </NavigationItem>
                    <NavigationItem page="react-hook-form">
                      React Hook Form
                    </NavigationItem>
                    <NavigationItem page="files">Files</NavigationItem>
                    <NavigationItem page="suspense">Suspense</NavigationItem>
                    <NavigationItem page="mstudio-loading">
                      mStudio loading
                    </NavigationItem>
                    <NavigationItem page="tunnel">Tunnel</NavigationItem>
                    <NavigationItem page="ext-bridge">
                      Ext Bridge
                    </NavigationItem>
                    <NavigationItem page="error">Error</NavigationItem>
                    <NavigationItem page="navigation">
                      Navigation
                    </NavigationItem>
                    <NavigationItem page="performance">
                      Performance
                    </NavigationItem>

                    <NavigationGroup collapsable>
                      <NavigationItem page="chart">Chart</NavigationItem>
                      <Heading>Components</Heading>
                      <NavigationItem page="context-menu">
                        Context Menu
                      </NavigationItem>
                      <NavigationItem page="svg">Icon/SVG</NavigationItem>
                      <NavigationItem page="list">List</NavigationItem>
                      <NavigationItem page="markdown">Markdown</NavigationItem>
                      <NavigationItem page="modal">Modal</NavigationItem>
                      <NavigationItem page="notification">
                        Notifications
                      </NavigationItem>
                      <NavigationItem page="popover">Popover</NavigationItem>
                    </NavigationGroup>
                    <TunnelExit id="remote-demo" />
                  </Navigation>
                </LayoutCard>
                <LayoutCard elementType="main" className={styles.main}>
                  <div>
                    <ErrorBoundary errorComponent={Error}>
                      <Suspense fallback={<LoadingMessage />}>
                        {props.children}
                      </Suspense>
                    </ErrorBoundary>
                  </div>
                </LayoutCard>
              </Flex>
            </div>
          </NotificationProvider>
        </RouterProvider>
      </body>
    </html>
  );
}
