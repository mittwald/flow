"use client";
import type { RemoteComponentRendererProps } from "@remote-dom/react/host";
import { RemoteReceiver, RemoteRootRenderer } from "@remote-dom/react/host";
import type { ComponentType, CSSProperties, FC } from "react";
import React, { useMemo } from "react";
import { components } from "@/components";
import type { RemoteComponentsMap } from "@/lib/types";
import { reduce } from "remeda";
import { connectRemoteIframeRef } from "@mittwald/flow-remote-core";
import Iframe from "@/components/Iframe";

export interface RemoteRendererProps {
  integrations?: RemoteComponentsMap<never>[];
  src: string;
  iframeStyle?: CSSProperties;
}

export const RemoteRenderer: FC<RemoteRendererProps> = (props) => {
  const { integrations = [], src, iframeStyle } = props;
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

  const remoteFrame = (
    <Iframe
      ref={connectRemoteIframeRef(receiver.connection)}
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
      <RemoteRootRenderer components={mergedComponents} receiver={receiver} />
      {remoteFrame}
    </>
  );
};
