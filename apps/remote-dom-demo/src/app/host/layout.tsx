"use client";
import { LoadingMessage } from "@/app/_components/LoadingMessage";
import { getHostPath, getRemotePath } from "@/app/_lib/navigation";
import {
  ColumnLayout,
  IntlProvider,
  Label,
  LabeledValue,
  Section,
  Separator,
  Text,
} from "@mittwald/flow-react-components";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import type { RemoteReadyEvent } from "@mittwald/flow-remote-react-renderer";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function HostPage() {
  const router = useRouter();
  const hostPath = usePathname();
  const remotePath = getRemotePath(hostPath);
  const srcRef = useRef(remotePath);
  const [isNavigating, setIsNavigating] = useState(false);
  const [remoteReadyEvent, setRemoteReadyEvent] = useState<RemoteReadyEvent>();

  return (
    <IntlProvider locale="de-DE">
      <Section>
        {isNavigating && <LoadingMessage />}
        {remoteReadyEvent && (
          <>
            <ColumnLayout>
              <LabeledValue>
                <Label>Communication version</Label>
                <Text>{remoteReadyEvent.version}</Text>
              </LabeledValue>
              <LabeledValue>
                <Label>Remote package</Label>
                <Text>{remoteReadyEvent.packageVersion ?? "unknown"}</Text>
              </LabeledValue>
            </ColumnLayout>
            <Separator />
          </>
        )}
        <RemoteRenderer
          onConnected={setRemoteReadyEvent}
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
      </Section>
    </IntlProvider>
  );
}
