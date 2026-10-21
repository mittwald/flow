"use client";
import {
  Flex,
  Heading,
  Label,
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
import { TunnelExit } from "@mittwald/flow-react-components/tunnel";
import { LoadingMessage } from "@/app/_components/LoadingMessage";
import { NavigationItem } from "@/app/_components/NavigationItem";

const Error: ErrorComponent = (props) => {
  const message =
    props.error instanceof globalThis.Error
      ? props.error.message
      : String(props.error);
  return <>REMOTE RENDER ERROR: {message}</>;
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
                    <NavigationGroup collapsable>
                      <Label>Rendering</Label>
                      <NavigationItem page="non-interactive">
                        Non-interactive
                      </NavigationItem>
                      <NavigationItem page="event-handler">
                        Event handler
                      </NavigationItem>
                      <NavigationItem page="suspense">Suspense</NavigationItem>
                      <NavigationItem page="tunnel">Tunnel</NavigationItem>
                      <NavigationItem page="performance">
                        Performance
                      </NavigationItem>
                    </NavigationGroup>
                    <NavigationGroup collapsable>
                      <Label>Forms</Label>
                      <NavigationItem page="simple-form">
                        Simple form
                      </NavigationItem>
                      <NavigationItem page="action-form">
                        Action form
                      </NavigationItem>
                      <NavigationItem page="react-hook-form">
                        React Hook Form
                      </NavigationItem>
                      <NavigationItem page="files">Files</NavigationItem>
                    </NavigationGroup>
                    <NavigationGroup collapsable>
                      <Label>Errors</Label>
                      <NavigationItem page="error">Error</NavigationItem>
                      <NavigationItem page="no-component">
                        No component
                      </NavigationItem>
                    </NavigationGroup>
                    <NavigationGroup collapsable>
                      <Label>Host integration</Label>
                      <NavigationItem page="navigation">
                        Navigation
                      </NavigationItem>
                      <NavigationItem page="ext-bridge">
                        Ext Bridge
                      </NavigationItem>
                      <NavigationItem page="mstudio-loading">
                        mStudio loading
                      </NavigationItem>
                    </NavigationGroup>
                    <NavigationGroup collapsable>
                      <Label>Components</Label>
                      <NavigationItem page="components/actions">
                        Actions
                      </NavigationItem>
                      <NavigationItem page="components/chat">
                        Chat
                      </NavigationItem>
                      <NavigationItem page="components/content">
                        Content
                      </NavigationItem>
                      <NavigationItem page="components/data-visualisation">
                        Data Visualisation
                      </NavigationItem>
                      <NavigationItem page="components/form-controls">
                        Form Controls
                      </NavigationItem>
                      <NavigationItem page="components/list">
                        List
                      </NavigationItem>
                      <NavigationItem page="components/navigation">
                        Navigation
                      </NavigationItem>
                      <NavigationItem page="components/overlays">
                        Overlays
                      </NavigationItem>
                      <NavigationItem page="components/status">
                        Status
                      </NavigationItem>
                      <NavigationItem page="components/structure">
                        Structure
                      </NavigationItem>
                      <NavigationItem page="components/upload">
                        Upload
                      </NavigationItem>
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
