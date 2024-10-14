import type { FlowRemoteElementKeys } from "@mittwald/flow-remote-elements";
import type { ComponentType } from "react";
import type { RemoteComponentRendererProps } from "@remote-dom/react/host";

export type RemoteComponentsMap = {
  [K in FlowRemoteElementKeys]: ComponentType<RemoteComponentRendererProps>;
};
