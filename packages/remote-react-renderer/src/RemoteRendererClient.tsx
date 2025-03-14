"use client";

import { components } from "@/components";
import type { RemoteComponentsMap } from "@/lib/types";
import type { RemoteComponentRendererProps } from "@mfalkenberg/remote-dom-react/host";
import {
  RemoteReceiver,
  RemoteRootRenderer,
} from "@mfalkenberg/remote-dom-react/host";
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
  renderErrorTimeout?: number;
}

interface PromiseObject {
  result: null | Promise<void> | Error;
  resolve: CallableFunction;
  reject: CallableFunction;
}

export const HiddenIframeStyle: CSSProperties = {
  visibility: "hidden",
  height: 0,
  width: 0,
  border: "none",
  position: "absolute",
  marginLeft: "-9999px",
};

const voidFunction = () => null;

export const RemoteRendererClient: FC<RemoteRendererProps> = (props) => {
  const { integrations = [], renderErrorTimeout = 10000, src } = props;
  const [, forceRerender] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const checkRenderTimeout = useRef<number>(null);
  const awaiter = useRef<PromiseObject>({
    result: null,
    resolve: voidFunction,
    reject: voidFunction,
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
    remoteReceiver.subscribe({ id: remoteReceiver.root.id }, () =>
      awaiter.resolve(),
    );

    return remoteReceiver;
  }, []);

  const connect = connectRemoteIframeRef(receiver.connection);

  useLayoutEffect(() => {
    if (!src || !iframeRef.current || iframeRef.current.src === src) {
      return;
    }

    clearRenderTimeout();
    iframeRef.current.src = src;

    awaiter.result = new Promise((resolve, reject) => {
      awaiter.resolve = () => {
        clearRenderTimeout();
        resolve();
        awaiter.result = null;
      };
      awaiter.reject = (reason: string) => {
        clearRenderTimeout();
        reject();
        awaiter.result = new Error(reason);
      };
    });

    forceRerender((old) => !old);
  }, [src, iframeRef]);

  const onIframeLoaded = () => {
    checkRenderTimeout.current = setTimeout(
      () =>
        awaiter.reject(
          "RemoteRenderTimeout reached. Remote URL was successfully loaded but no Remote Component was rendered in time.",
        ),
      renderErrorTimeout,
    );
  };

  const onIframeError = () =>
    awaiter.reject("Remote URL could not be reached and was not loaded.");

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
