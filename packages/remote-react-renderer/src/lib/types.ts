import type { RemoteComponentRendererProps } from "@mittwald/remote-dom-react/host";
import type { ComponentType } from "react";

export type RemoteComponentsMap<T extends string> = Record<
  T,
  ComponentType<RemoteComponentRendererProps>
>;
