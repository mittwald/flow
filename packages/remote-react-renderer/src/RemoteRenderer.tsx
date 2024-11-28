"use client";
import { RemoteReceiver, RemoteRootRenderer } from "@remote-dom/react/host";
import type { FC } from "react";
import React, { useMemo } from "react";
import { components } from "@/components";
import type { RemoteComponentsMap } from "@/lib/types";
import { reduce } from "remeda";
import { connectRemoteIframeRef } from "@mittwald/flow-remote-core";

export interface RemoteRendererProps {
  integrations?: RemoteComponentsMap<never>[];
  src: string;
}

export const RemoteRenderer: FC<RemoteRendererProps> = (props) => {
  const { integrations = [], src } = props;
  const receiver = useMemo(() => new RemoteReceiver(), []);

  const mergedComponents = useMemo(
    () =>
      reduce(
        [...integrations, components],
        (merged, current) => ({
          ...merged,
          ...current,
        }),
        {} as RemoteComponentsMap<never>,
      ),
    [...integrations],
  );

  const remoteFrame = (
    <iframe
      ref={connectRemoteIframeRef(receiver.connection)}
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
  );

  return (
    <>
      <RemoteRootRenderer
        components={new Map(Object.entries(mergedComponents))}
        receiver={receiver}
      />
      {remoteFrame}
    </>
  );
};
