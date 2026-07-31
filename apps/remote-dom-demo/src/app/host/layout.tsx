"use client";
import { LoadingMessage } from "@/app/_components/LoadingMessage";
import { getHostPath, getRemotePath } from "@/app/_lib/navigation";
import {
  Badge,
  ColumnLayout,
  Flex,
  IntlProvider,
  Label,
  LabeledValue,
  Section,
  Separator,
  Text,
} from "@mittwald/flow-react-components";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import type {
  ComponentUsageEvent,
  RemoteReadyEvent,
} from "@mittwald/flow-remote-react-renderer";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export default function HostPage() {
  const router = useRouter();
  const hostPath = usePathname();
  const remotePath = getRemotePath(hostPath);
  const srcRef = useRef(remotePath);
  const [isNavigating, setIsNavigating] = useState(false);
  const [remoteReadyEvent, setRemoteReadyEvent] = useState<RemoteReadyEvent>();
  const [componentUsage, setComponentUsage] = useState<ComponentUsageEvent[]>(
    [],
  );

  const addComponentUsage = useCallback((event: ComponentUsageEvent) => {
    setComponentUsage((usage) =>
      [...usage, event].toSorted((a, b) =>
        a.component.localeCompare(b.component),
      ),
    );
  }, []);

  return (
    <IntlProvider locale="en-US">
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
        {componentUsage.length > 0 && (
          <>
            <LabeledValue>
              <Label>Used components ({componentUsage.length})</Label>
              <Flex gap="s" wrap="wrap">
                {componentUsage.map(({ component, status }) => (
                  <Badge
                    key={component}
                    color={
                      status?.level === "deprecated"
                        ? "red"
                        : status?.level === "beta"
                          ? "orange"
                          : "neutral"
                    }
                  >
                    <Label>{component}</Label>
                    <Text>{status?.level ?? "untracked"}</Text>
                  </Badge>
                ))}
              </Flex>
            </LabeledValue>
            <Separator />
          </>
        )}
        <RemoteRenderer
          onComponentUsage={addComponentUsage}
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
              extensionId: "ext-death-star",
              extensionInstanceId: "exti-death-star",
              sessionId: "session-rebel-alliance",
              userId: "user-luke-skywalker",
              appInstallationId: "appi-death-star",
              customerId: "customer-rebel-alliance",
              projectId: "mission-death-star",
            }),
            getSessionToken: async () => "session-token",
          }}
        />
      </Section>
    </IntlProvider>
  );
}
