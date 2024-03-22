import { Signal } from "@preact/signals-react";
import { createContext, ReactNode } from "react";

export type TunnelNodes = Record<string, ReactNode>;

export interface TunnelContext {
  children: Signal<TunnelNodes>;
}

export const tunnelContext = createContext<TunnelContext>({
  children: {
    value: {},
  },
} as TunnelContext);

export default tunnelContext;
