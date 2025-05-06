"use client";

import { useAwaiter } from "@/hooks/useAwaiter";
import { useMergedComponents } from "@/hooks/useMergedComponents";
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
import {
  type CSSProperties,
  type FC,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

  const renderAwaiter = useAwaiter([src]);
  const connectionAwaiter = useAwaiter([src]);
  const loadingAwaiter = useAwaiter([src]);

  const [connectedSrc, setConnectedSrc] = useState<string | null>(null);
  const [remoteError, setRemoteError] = useState<string | undefined>();
  const connection = useRef<HostToRemoteConnection | undefined>(undefined);

  if (remoteError) {
    throw new RemoteError(`Remote rendering failed: ${remoteError}`);
  }

  const remoteComponents = useMergedComponents(integrations);

  const receiver = useMemo(() => {
    const remoteReceiver = new RemoteReceiver();
    remoteReceiver.subscribe(
      { id: remoteReceiver.root.id },
      renderAwaiter.resolve,
    );
    return remoteReceiver;
  }, [src]);

  useLayoutEffect(() => {
    if (hostPathname && connection.current) {
      connection.current.imports.setPathname(hostPathname);
    }
  }, [hostPathname]);

  const connect = connectRemoteIframeRef({
    connection: receiver.connection,
    extBridgeImplementation: extBridgeImplementation,
    onReady: connectionAwaiter.resolve,
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
        loadingAwaiter.promise,
        timeoutPromise("Remote URL could not be loaded"),
      ]),
      Promise.race([
        connectionAwaiter.promise,
        timeoutPromise("Could not establish remote connection"),
      ]),
      Promise.race([
        renderAwaiter.promise,
        timeoutPromise("Remote rendering failed"),
      ]),
    ]);

  const awaitLoadingPromise = connectedSrc === src;
  usePromise(overallLoading, awaitLoadingPromise ? [] : null, {
    loaderId: src,
  });

  return (
    <>
      <RemoteRootRenderer components={remoteComponents} receiver={receiver} />
      <iframe
        src={src}
        ref={(ref) => {
          connection.current = connect(ref);
          setConnectedSrc(src);
        }}
        onLoad={loadingAwaiter.resolve}
        onError={loadingAwaiter.reject}
        style={hiddenIframeStyle}
      />
    </>
  );
};

export default RemoteRendererBrowser;
