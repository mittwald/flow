import { createContext } from "react";
import { TunnelState } from "~/TunnelState";

export const tunnelContext = createContext<TunnelState>(new TunnelState());

export default tunnelContext;
