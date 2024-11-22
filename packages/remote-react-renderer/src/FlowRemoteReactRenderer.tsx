import { RemoteReceiver, RemoteRootRenderer } from "@remote-dom/react/host";
import type { FC } from "react";
import React, { useMemo } from "react";
import { components } from "@/components";
import type { RemoteComponentsMap } from "@/lib/types";
import { reduce } from "remeda";
import { connectRemoteIframeRef } from "@mittwald/flow-remote-core";

export interface ReactRemoteRendererProps {
  integrations?: RemoteComponentsMap<never>[];
  src: string;
}

export const FlowRemoteReactRenderer: FC<ReactRemoteRendererProps> = (
  props,
) => {
  const { integrations = [], src } = props;
  const receiver = useMemo(() => new RemoteReceiver(), []);

  const mergedComponents = reduce(
    [...integrations, components],
    (merged, current) => ({
      ...merged,
      ...current,
    }),
    {} as RemoteComponentsMap<never>,
  );

  return (
    <>
      <RemoteRootRenderer
        components={new Map(Object.entries(mergedComponents))}
        receiver={receiver}
      />
      <iframe ref={connectRemoteIframeRef(receiver.connection)} src={src} />
    </>
  );
};
