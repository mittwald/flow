"use client";
import "./layout.css";
import { getHostPath, getRemotePath } from "@/app/_lib/navigation";
import {
  Heading,
  IllustratedMessage,
  LoadingSpinner,
} from "@mittwald/flow-react-components";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { NotificationProvider } from "@mittwald/flow-react-components";
import "@mittwald/flow-react-components/all.css";
import { RouterProvider } from "@mittwald/flow-react-components/nextjs";
import type { ErrorComponent } from "next/dist/client/components/error-boundary";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import styles from "./layout.module.css";
import clsx from "clsx";

const Error: ErrorComponent = (props) => {
  return <>REMOTE RENDER ERROR: {props.error.message}</>;
};

export default function HostPage() {
  const router = useRouter();
  const hostPath = usePathname();
  const remotePath = getRemotePath(hostPath);
  const srcRef = useRef(remotePath);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showIFrame, setShowIFrame] = useState(true);

  return (
    <RouterProvider>
      <NotificationProvider>
        <div className={styles.rootContainer}>
          <main>
            <div
              className={clsx(styles.remote, showIFrame && styles.showIFrame)}
            >
              <ErrorBoundary errorComponent={Error}>
                <Suspense
                  fallback={
                    <IllustratedMessage>
                      <LoadingSpinner />
                      <Heading>Lade Demo</Heading>
                    </IllustratedMessage>
                  }
                >
                  {isNavigating && (
                    <IllustratedMessage>
                      <LoadingSpinner />
                      <Heading>Lade Demo</Heading>
                    </IllustratedMessage>
                  )}
                  <RemoteRenderer
                    onNavigationStateChanged={(state) => {
                      const { pathname, isPending } = state;
                      router.replace(getHostPath(pathname));
                      setIsNavigating(isPending);
                    }}
                    hostPathname={hostPath}
                    src={srcRef.current}
                    extBridgeImplementation={{
                      getConfig: async () => ({
                        extensionId: "ext-id",
                        extensionInstanceId: "exti-id",
                        sessionId: "session-id",
                        userId: "user-id",
                        appInstallationId: "appi-id",
                        customerId: "customer-id",
                        projectId: "project-id",
                      }),
                      getSessionToken: async () => "session-token",
                    }}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </NotificationProvider>
    </RouterProvider>
  );
}
