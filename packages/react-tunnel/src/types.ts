import type { ReactNode } from "react";

export type TunnelExitChildren =
  | ReactNode
  | undefined
  | ((tunnelChildren?: ReactNode | undefined) => ReactNode | undefined);

export type TunnelEntryChildren =
  | ReactNode
  | undefined
  | (() => ReactNode | undefined);

export interface TunnelEntryProps {
  id?: string;
  children?: TunnelEntryChildren;
  /** Static entry ID instead of generated ID by `useId` */
  staticEntryId?: string;
}

export interface TunnelExitProps {
  id?: string;
  children?: TunnelExitChildren;
}
