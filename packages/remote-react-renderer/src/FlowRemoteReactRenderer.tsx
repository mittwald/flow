import type { RemoteRootRendererProps } from "@remote-dom/react/host";
import { RemoteRootRenderer } from "@remote-dom/react/host";
import type { FC } from "react";
import React from "react";
import { components } from "@/components";
import type { RemoteComponentsMap } from "@/lib/types";
import { reduce } from "remeda";

export interface ReactRemoteRendererProps {
  receiver: RemoteRootRendererProps["receiver"];
  integrations?: RemoteComponentsMap<never>[];
}

export const FlowRemoteReactRenderer: FC<ReactRemoteRendererProps> = (
  props,
) => {
  const { receiver, integrations = [] } = props;

  const mergedComponents = reduce(
    [...integrations, components],
    (merged, current) => ({
      ...merged,
      ...current,
    }),
    {} as RemoteComponentsMap<never>,
  );

  return (
    <RemoteRootRenderer
      components={new Map(Object.entries(mergedComponents))}
      receiver={receiver}
    />
  );
};
