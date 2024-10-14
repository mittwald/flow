import type { RemoteRootRendererProps } from "@remote-dom/react/host";
import type { FC } from "react";
import React from "react";

export interface ReactRemoteRendererProps {
  receiver: RemoteRootRendererProps["receiver"];
}

export const FlowReactRemoteRenderer: FC<ReactRemoteRendererProps> = (
  props,
) => {
  const { receiver } = props;
  return <FlowReactRemoteRenderer receiver={receiver} />;
};
