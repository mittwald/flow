"use client";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { usePathname } from "next/navigation";

export default function HostPage() {
  const path = usePathname();
  return (
    <RemoteRenderer
      src={path.replace("/host/", "/remote/")}
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
  );
}
