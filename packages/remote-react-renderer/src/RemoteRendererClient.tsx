"use client";
import { components } from "@/components";
import type { RemoteComponentsMap } from "@/lib/types";
import type { RemoteComponentRendererProps } from "@mfalkenberg/remote-dom-react/host";
import {
  RemoteReceiver,
  RemoteRootRenderer,
} from "@mfalkenberg/remote-dom-react/host";
import { connectRemoteIframeRef } from "@mittwald/flow-remote-core";
import type { ComponentType, CSSProperties, FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import { reduce } from "remeda";

export interface RemoteRendererProps {
  integrations?: RemoteComponentsMap<never>[];
  src: string;
  iframeStyle?: CSSProperties;
  fallback?: ReactNode;
}

export const RemoteRendererClient: FC<RemoteRendererProps> = (props) => {
  const { integrations = [], src, iframeStyle, fallback } = props;
  const receiver = useMemo(() => new RemoteReceiver(), []);

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

  const connect = connectRemoteIframeRef(receiver.connection);

  const [iframeHasLoaded, setIframeHasLoaded] = useState(false);

  const remoteFrame = (
    <iframe
      onLoad={() => setIframeHasLoaded(true)}
      ref={connect}
      src={src}
      style={
        iframeStyle ?? {
          visibility: "hidden",
          height: 0,
          width: 0,
          border: "none",
          position: "absolute",
          marginLeft: "-9999px",
        }
      }
    />
  );

  return (
    <>
      {!iframeHasLoaded && fallback}
      <RemoteRootRenderer components={mergedComponents} receiver={receiver} />
      {remoteFrame}
    </>
  );
};

export default RemoteRendererClient;
