import type { ReactNode } from "react";

export type TunnelChildren =
  | ReactNode
  | undefined
  | ((tunnelChildren?: ReactNode | undefined) => ReactNode | undefined);

export interface TunnelEntryProps {
  id?: string;
  children?: TunnelChildren;
  /** Static entry ID instead of generated ID by `useId` */
  staticEntryId?: string;
}

export interface TunnelExitProps {
  id?: string;
  children?: TunnelChildren;
}
