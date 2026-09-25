"use client";
import { LoadingMessage } from "@/app/_components/LoadingMessage";
import { getHostPath } from "@/app/_lib/navigation";
import {
  Badge,
  ColumnLayout,
  Flex,
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
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, type FC } from "react";

const UsageList: FC<{ usage: ComponentUsageEvent[] }> = ({ usage }) => (
  <LabeledValue>
    <Label>Used components ({usage.length})</Label>
    <Flex gap="s" wrap="wrap">
      {usage.map(({ component, status }) => (
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
);

interface Props {
  /** The remote app to load — a `/remote/…` or `/remote-svelte/…` route. */
  src: string;
  hostPathname: string;
}

/**
 * One remote app, rendered by the host, with the connection metadata it
 * reported.
 *
 * Each framework gets its own instance: the state below describes the connected
 * remote, so switching frameworks has to start from nothing rather than carry
 * the other one's numbers over.
 */
export const RemoteFrame: FC<Props> = ({ src, hostPathname }) => {
  const router = useRouter();
  /* Pinned: the host rewrites its own URL as the remote navigates, and that
   * must not reload the iframe underneath it. */
  const srcRef = useRef(src);
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

  /*
   * Its own `Section`, because the tab panel around it is a plain container:
   * `Section` is what gives these blocks their vertical rhythm, and without one
   * the metadata, the component list and the remote output stack flush.
   */
  return (
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
          <UsageList usage={componentUsage} />
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
        hostPathname={hostPathname}
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
  );
};

export default RemoteFrame;
