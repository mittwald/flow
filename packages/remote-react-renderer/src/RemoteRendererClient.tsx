"use client";

import { components } from "@/components";
import type { RemoteComponentsMap } from "@/lib/types";
import type { RemoteComponentRendererProps } from "@mfalkenberg/remote-dom-react/host";
import {
  RemoteReceiver,
  RemoteRootRenderer,
} from "@mfalkenberg/remote-dom-react/host";
import type { ExtBridgeRemoteApi } from "@mittwald/ext-bridge";
import { connectRemoteIframeRef } from "@mittwald/flow-remote-core";
import {
  type ComponentType,
  type CSSProperties,
  type FC,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { reduce } from "remeda";

export interface RemoteRendererProps {
  integrations?: RemoteComponentsMap<never>[];
  src: string;
  timeout?: number;
  extBridgeImplementation?: ExtBridgeRemoteApi;
}

interface PromiseObject {
  result: null | Promise<void[]> | Error;
  resolveRenderer: CallableFunction;
  rejectRenderer: CallableFunction;
  resolveConnection: CallableFunction;
  rejectConnection: CallableFunction;
}

const HiddenIframeStyle: CSSProperties = {
  visibility: "hidden",
  height: 0,
  width: 0,
  border: "none",
  position: "absolute",
  marginLeft: "-9999px",
};

const voidFunction = () => null;

export const RemoteRendererClient: FC<RemoteRendererProps> = (props) => {
  const {
    integrations = [],
    timeout = 10_000,
    src,
    extBridgeImplementation,
  } = props;

  const [, forceRerender] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const checkRenderTimeout = useRef<number>(null);

  const awaiter = useRef<PromiseObject>({
    result: null,
    resolveConnection: voidFunction,
    rejectConnection: voidFunction,
    resolveRenderer: voidFunction,
    rejectRenderer: voidFunction,
  }).current;

  if (awaiter.result !== null) {
    throw awaiter.result;
  }

  const clearRenderTimeout = () => {
    if (checkRenderTimeout.current) {
      clearTimeout(checkRenderTimeout.current);
    }
  };

  const mergedComponents = useMemo(() => {
    return new Map<string, ComponentType<RemoteComponentRendererProps>>(
      Object.entries(
        reduce(
          [...integrations, components],
          (merged, current) => ({
            ...merged,
            ...current,
          }),
          {},
        ),
      ),
    );
  }, [...integrations]);

  const receiver = useMemo(() => {
    const remoteReceiver = new RemoteReceiver();
    remoteReceiver.subscribe({ id: remoteReceiver.root.id }, () => {
      awaiter.resolveRenderer();
    });

    return remoteReceiver;
  }, []);

  const connect = connectRemoteIframeRef({
    connection: receiver.connection,
    extBridgeImplementation: extBridgeImplementation,
    onReady: () => {
      awaiter.resolveConnection();
    },
  });

  useLayoutEffect(() => {
    if (!src || !iframeRef.current || iframeRef.current.src === src) {
      return;
    }

    clearRenderTimeout();
    iframeRef.current.src = src;

    awaiter.result = Promise.all<void>([
      new Promise((resolve, reject) => {
        awaiter.resolveRenderer = () => {
          clearRenderTimeout();
          resolve();
          awaiter.result = null;
        };
        awaiter.rejectRenderer = (reason: string) => {
          clearRenderTimeout();
          reject();
          awaiter.result = new Error(reason);
        };
      }),
      new Promise((resolve, reject) => {
        awaiter.resolveConnection = () => {
          resolve();
          awaiter.result = null;
        };
        awaiter.rejectConnection = (reason: string) => {
          reject();
          awaiter.result = new Error(reason);
        };
      }),
    ]);

    forceRerender((old) => !old);
  }, [src, iframeRef]);

  const onIframeLoaded = () => {
    checkRenderTimeout.current = setTimeout(
      () =>
        awaiter.rejectRenderer(
          "RemoteRenderTimeout reached. Remote URL was successfully loaded but no Remote Component was rendered in time.",
        ),
      timeout,
    );
  };

  const onIframeError = () =>
    awaiter.resolveRenderer(
      "Remote URL could not be reached and was not loaded.",
    );

  return (
    <>
      <RemoteRootRenderer components={mergedComponents} receiver={receiver} />
      <iframe
        ref={(ref) => {
          iframeRef.current = ref;
          return connect(ref);
        }}
        onLoad={onIframeLoaded}
        onError={onIframeError}
        style={HiddenIframeStyle}
      />
    </>
  );
};

export default RemoteRendererClient;
