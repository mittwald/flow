import type { ReactNode } from "react";

export type TunnelChildren =
  | ReactNode
  | undefined
  | (() => ReactNode | undefined);
