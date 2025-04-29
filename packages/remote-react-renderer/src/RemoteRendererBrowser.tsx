"use client";

import { useAwaiter } from "@/hooks/useAwaiter";
import { useMergedComponents } from "@/hooks/useMergedComponents";
import type { RemoteComponentsMap } from "@/lib/types";
import type { ExtBridgeConnectionApi } from "@mittwald/ext-bridge";
import {
  connectRemoteIframeRef,
  RemoteError,
} from "@mittwald/flow-remote-core";
import { usePromise } from "@mittwald/react-use-promise";
import {
  RemoteReceiver,
  RemoteRootRenderer,
} from "@mittwald/remote-dom-react/host";
import { type CSSProperties, type FC, useMemo, useState } from "react";

export interface RemoteRendererBrowserProps {
  integrations?: RemoteComponentsMap<never>[];
  src: string;
  timeoutMs?: number;
  onPathnameChanged?: (pathname: string) => void;
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
    onPathnameChanged,
  } = props;

  const renderAwaiter = useAwaiter([src]);
  const connectionAwaiter = useAwaiter([src]);
  const loadingAwaiter = useAwaiter([src]);

  const [connectedSrc, setConnectedSrc] = useState<string | null>(null);
  const [remoteError, setRemoteError] = useState<string | undefined>();

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

  const connect = connectRemoteIframeRef({
    connection: receiver.connection,
    extBridgeImplementation: extBridgeImplementation,
    onReady: connectionAwaiter.resolve,
    onError: setRemoteError,
    onPathnameChanged,
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
        key={src}
        src={src}
        ref={(ref) => {
          connect(ref);
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
