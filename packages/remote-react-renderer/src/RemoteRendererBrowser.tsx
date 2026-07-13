"use client";

import { useMergedComponents } from "@/hooks/useMergedComponents";
import { useControllableSuspenseTrigger } from "@/hooks/useControllableSuspenseTrigger";
import { useUpdateHostPathnameOnRemote } from "@/hooks/useUpdateHostPathnameOnRemote";
import type { RemoteComponentsMap } from "@/lib/types";
import {
  connectRemoteIframeRef,
  RemoteError,
  type HostToRemoteConnection,
  type NavigationState,
  type RemoteExtBridgeConnectionApi,
  type RemoteReadyEvent,
} from "@mittwald/flow-remote-core";
import { refresh, usePromise } from "@mittwald/react-use-promise";
import {
  RemoteReceiver,
  RemoteRootRenderer,
} from "@mittwald/remote-dom-react/host";
import {
  type CSSProperties,
  type FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLanguage, useTheme } from "@mittwald/flow-react-components";
import type { HostConfig } from "@mittwald/flow-core";

export interface RemoteRendererBrowserProps {
  integrations?: RemoteComponentsMap<never>[];
  src?: string;
  timeoutMs?: number;
  onNavigationStateChanged?: (state: NavigationState) => void;
  onConnected?: (event: RemoteReadyEvent) => void;
  hostPathname?: string;
  extBridgeImplementation?: RemoteExtBridgeConnectionApi;
  /** Internal use only */
  __remoteReceiver?: RemoteReceiver;
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
    onConnected,
    hostPathname,
    __remoteReceiver: remoteReceiverFromProps,
  } = props;

  const remoteComponents = useMergedComponents(integrations);

  if (remoteReceiverFromProps) {
    return (
      <RemoteRootRenderer
        components={remoteComponents}
        receiver={remoteReceiverFromProps}
      />
    );
  }

  if (!src) {
    throw new RemoteError("'src' prop is required");
  }

  const language = useLanguage();
  const theme = useTheme();

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

  const hostConfig: HostConfig = {
    language,
    theme,
  };

  const connect = connectRemoteIframeRef({
    connection: receiver.connection,
    extBridgeImplementation,
    hostConfig,
    onReady: ({ connection: establishedConnection, remoteReadyEvent }) => {
      establishedConnection.updateHostPathname(hostPathname);
      onConnected?.(remoteReadyEvent);
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

  const loaderResourceTag = `mittwald/remote-react-renderer/connect/${src}`;

  // refresh on remount
  useEffect(
    () => () => {
      refresh({
        tag: loaderResourceTag,
      });
    },
    [src],
  );

  usePromise(
    async () => {
      await overallLoading();
      rendererSubscriber.abort();
    },
    awaitLoadingPromise ? [] : null,
    {
      loaderId: src,
      tags: [loaderResourceTag],
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
