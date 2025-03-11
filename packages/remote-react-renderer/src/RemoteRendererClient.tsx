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
  type FC,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useMemo } from "react";
import { reduce } from "remeda";

export interface RemoteRendererProps {
  integrations?: RemoteComponentsMap<never>[];
  src: string;
}

interface PromiseObject {
  promise: null | Promise<void>;
  resolve?: CallableFunction;
}

export const RemoteRendererClient: FC<RemoteRendererProps> = (props) => {
  const { integrations = [], src } = props;

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

  const receiver = useMemo(() => new RemoteReceiver(), []);
  const awaiter = useRef<PromiseObject>({
    promise: null,
  }).current;

  const [initialRendered, forceRerender] = useState(false);
  const connect = connectRemoteIframeRef(receiver.connection);
  receiver.subscribe({ id: receiver.root.id }, () => {
    if (awaiter.promise !== null && awaiter.resolve) {
      awaiter.resolve();
    }
  });

  useLayoutEffect(() => {
    if (awaiter.promise !== null || initialRendered) {
      return;
    }

    awaiter.promise = new Promise((resolve) => {
      awaiter.resolve = () => {
        awaiter.promise = null;
        resolve();
      };
    });

    forceRerender(true);
  }, [forceRerender]);

  if (awaiter.promise !== null) {
    throw awaiter.promise;
  }

  return (
    <>
      <RemoteRootRenderer components={mergedComponents} receiver={receiver} />
      <iframe
        ref={connect}
        src={src}
        style={{
          visibility: "hidden",
          height: 0,
          width: 0,
          border: "none",
          position: "absolute",
          marginLeft: "-9999px",
        }}
      />
    </>
  );
};

export default RemoteRendererClient;
