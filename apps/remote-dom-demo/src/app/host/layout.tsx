"use client";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";

const isNavigationExample = (path: string) => path.includes("/navigation/");

export default function HostPage() {
  const router = useRouter();

  const path = usePathname();

  const remotePath = path.replace("/host/", "/remote/");
  const prevRemotePath = useRef(remotePath);

  const navigatedInsideExample =
    isNavigationExample(path) && isNavigationExample(prevRemotePath.current);

  const src = navigatedInsideExample ? prevRemotePath.current : remotePath;
  prevRemotePath.current = src;

  return (
    <RemoteRenderer
      onPathnameChanged={(pathname) =>
        router.push(pathname.replace("/remote/", "/host/"))
      }
      src={src}
      extBridgeImplementation={{
        getConfig: async () => ({
          extensionId: "ext-id",
          extensionInstanceId: "exti-id",
          sessionId: "session-id",
          userId: "user-id",
        }),
        getSessionToken: async () => "session-token",
      }}
    />
  );
}
