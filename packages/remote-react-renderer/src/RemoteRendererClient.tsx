"use client";

import { useAwaiter } from "@/hooks/useAwaiter";
import { useForceRerender } from "@/hooks/useForceRerender";
import { useMergedComponents } from "@/hooks/useMergedComponents";
import type { RemoteComponentsMap } from "@/lib/types";
import {
  RemoteReceiver,
  RemoteRootRenderer,
} from "@mfalkenberg/remote-dom-react/host";
import type { ExtBridgeRemoteApi } from "@mittwald/ext-bridge";
import { connectRemoteIframeRef } from "@mittwald/flow-remote-core";
import { usePromise } from "@mittwald/react-use-promise";
import { type CSSProperties, type FC, useMemo, useRef } from "react";

export interface RemoteRendererProps {
  integrations?: RemoteComponentsMap<never>[];
  src: string;
  timeoutMs?: number;
  extBridgeImplementation?: ExtBridgeRemoteApi;
}

const hiddenIframeStyle: CSSProperties = {
  visibility: "hidden",
  height: 0,
  width: 0,
  border: "none",
  position: "absolute",
  marginLeft: "-9999px",
};

export const RemoteRendererClient: FC<RemoteRendererProps> = (props) => {
  const {
    integrations = [],
    timeoutMs = 10_000,
    src,
    extBridgeImplementation,
  } = props;

  const renderAwaiter = useAwaiter([src]);
  const connectionAwaiter = useAwaiter([src]);
  const loadingAwaiter = useAwaiter([src]);

  const rendererSrc = useRef<string | null>(null);
  const rerender = useForceRerender();

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
  });

  const timeoutPromise = (message: string) =>
    new Promise((_, rej) => {
      setTimeout(() => {
        rej(new Error(`${message}: Timeout reached`));
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

  const awaitLoadingPromise = rendererSrc.current === src;
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
          rendererSrc.current = src;
          rerender();
        }}
        onLoad={loadingAwaiter.resolve}
        onError={loadingAwaiter.reject}
        style={hiddenIframeStyle}
      />
    </>
  );
};

export default RemoteRendererClient;
