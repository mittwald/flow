import { Signal } from "@preact/signals-react";
import { createContext, ReactNode } from "react";

export type TunnelNodes = Record<string, ReactNode>;

export interface TunnelContext {
  nodes: Signal<TunnelNodes>;
}

export const tunnelContext = createContext<TunnelContext>({} as TunnelContext);

export default tunnelContext;
