"use client";

import { useMergedComponents } from "@/hooks/useMergedComponents";
import { useControllableSuspenseTrigger } from "@/hooks/useControllableSuspenseTrigger";
import { useUpdateHostPathnameOnRemote } from "@/hooks/useUpdateHostPathnameOnRemote";
import type { RemoteComponentsMap } from "@/lib/types";
import type { ExtBridgeConnectionApi } from "@mittwald/ext-bridge";
import {
  connectRemoteIframeRef,
  RemoteError,
  type HostToRemoteConnection,
  type NavigationState,
} from "@mittwald/flow-remote-core";
import { usePromise } from "@mittwald/react-use-promise";
import {
  RemoteReceiver,
  RemoteRootRenderer,
} from "@mittwald/remote-dom-react/host";
import { type CSSProperties, type FC, useMemo, useRef, useState } from "react";

export interface RemoteRendererBrowserProps {
  integrations?: RemoteComponentsMap<never>[];
  src: string;
  timeoutMs?: number;
  onNavigationStateChanged?: (state: NavigationState) => void;
  hostPathname?: string;
  extBridgeImplementation?: ExtBridgeConnectionApi;
}

const hiddenIframeStyle: CSSProperties = {
  visibility: "hidden",
  height: 0,
  width: 0,
  border: "none",
  position: "absolute",
  marginLeft: "-9999px",
};

export const RemoteRendererBrowser: FC<RemoteRendererBrowserProps> = (
  props,
) => {
  const {
    integrations = [],
    timeoutMs = 10_000,
    src,
    extBridgeImplementation,
    onNavigationStateChanged,
    hostPathname,
  } = props;

  const renderPromise = useMemo(() => Promise.withResolvers<void>(), [src]);
  const connectionPromise = useMemo(() => Promise.withResolvers<void>(), [src]);
  const loadingPromise = useMemo(() => Promise.withResolvers<void>(), [src]);
  const suspenseTrigger = useControllableSuspenseTrigger();

  const [connectionSrc, setConnectionSrc] = useState<string | null>(null);
  const connection = useRef<HostToRemoteConnection>(undefined);
  const [remoteError, setRemoteError] = useState<string | undefined>();

  if (remoteError) {
    throw new RemoteError(`Remote rendering failed: ${remoteError}`);
  }

  const remoteComponents = useMergedComponents(integrations);

  const [receiver, rendererSubscriber] = useMemo(() => {
    const remoteReceiver = new RemoteReceiver();
    const controller = new AbortController();
    remoteReceiver.subscribe(
      { id: remoteReceiver.root.id },
      () => renderPromise.resolve(),
      { signal: controller.signal },
    );
    return [remoteReceiver, controller];
  }, [src]);

  useUpdateHostPathnameOnRemote(hostPathname, connection.current);

  const connect = connectRemoteIframeRef({
    connection: receiver.connection,
    extBridgeImplementation: extBridgeImplementation,
    onReady: (establishedConnection) => {
      establishedConnection.updateHostPathname(hostPathname);
      connectionPromise.resolve();
    },
    onLoadingChanged: (isLoading) => {
      if (isLoading) {
        suspenseTrigger.start();
      } else {
        suspenseTrigger.stop();
      }
    },
    onError: setRemoteError,
    onNavigationStateChanged,
  });

  const timeoutPromise = (message: string) =>
    new Promise((_, rej) => {
      setTimeout(() => {
        rej(new RemoteError(`${message}: Timeout reached`));
      }, timeoutMs);
    });

  const overallLoading = () =>
    Promise.all([
      Promise.race([
        loadingPromise.promise,
        timeoutPromise("Remote URL could not be loaded"),
      ]),
      Promise.race([
        connectionPromise.promise,
        timeoutPromise("Could not establish remote connection"),
      ]),
      Promise.race([
        renderPromise.promise,
        timeoutPromise("Remote rendering failed"),
      ]),
    ]);

  const awaitLoadingPromise = connectionSrc === src;

  usePromise(
    async () => {
      await overallLoading();
      rendererSubscriber.abort();
    },
    awaitLoadingPromise ? [] : null,
    {
      loaderId: src,
    },
  );

  return (
    <>
      <RemoteRootRenderer components={remoteComponents} receiver={receiver} />
      <iframe
        src={src}
        ref={(ref) => {
          connection.current = connect(ref);
          setConnectionSrc(src);
        }}
        onLoad={() => loadingPromise.resolve()}
        onError={() => loadingPromise.reject()}
        style={hiddenIframeStyle}
      />
    </>
  );
};

export default RemoteRendererBrowser;
