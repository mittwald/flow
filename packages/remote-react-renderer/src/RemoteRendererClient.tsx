"use client";
import { components } from "@/components";
import type { RemoteComponentsMap } from "@/lib/types";
import { connectRemoteIframeRef } from "@mittwald/flow-remote-core";
import type { RemoteComponentRendererProps } from "@remote-dom/react/host";
import { RemoteReceiver, RemoteRootRenderer } from "@remote-dom/react/host";
import type { ComponentType, CSSProperties, FC, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { reduce } from "remeda";

export interface RemoteRendererProps {
  integrations?: RemoteComponentsMap<never>[];
  src: string;
  iframeStyle?: CSSProperties;
  data?: unknown;
  fallback?: ReactNode;
}

export const RemoteRendererClient: FC<RemoteRendererProps> = (props) => {
  const { integrations = [], src, iframeStyle, data, fallback } = props;
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
  const connection = useRef<ReturnType<typeof connect>>(null);

  useEffect(() => {
    connection.current?.receiveData(data);
  }, [data, connection]);

  const [iframeHasLoaded, setIframeHasLoaded] = useState(false);

  const remoteFrame = (
    <iframe
      onLoad={() => setIframeHasLoaded(true)}
      ref={(iframe) => {
        if (iframe) {
          connection.current = connect(iframe);
          connection.current.receiveData(data);
        }
      }}
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
