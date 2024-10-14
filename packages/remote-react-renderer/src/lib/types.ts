import type { ComponentType } from "react";
import type { RemoteComponentRendererProps } from "@remote-dom/react/host";

export type RemoteComponentsMap<T extends string> = {
  [K in T]: ComponentType<RemoteComponentRendererProps>;
};
