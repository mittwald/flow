"use client";
import { LoadingMessage } from "@/app/_components/LoadingMessage";
import { getHostPath, getRemotePath } from "@/app/_lib/navigation";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function HostPage() {
  const router = useRouter();
  const hostPath = usePathname();
  const remotePath = getRemotePath(hostPath);
  const srcRef = useRef(remotePath);
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <>
      {isNavigating && <LoadingMessage />}
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
    </>
  );
}
