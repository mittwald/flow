import { createContext, useContext } from "react";
import { defaultTunnelProviderId, TunnelState } from "@/TunnelState";

interface TunnelContext {
  state: TunnelState;
  parentContext?: TunnelContext;
}

export const tunnelContext = createContext<TunnelContext>({
  state: new TunnelState(),
});

export default tunnelContext;

export const useTunnelState = (id = defaultTunnelProviderId) => {
  let context: TunnelContext | undefined = useContext(tunnelContext);

  while (context) {
    if (context.state.id === id) {
      return context.state;
    }
    context = context.parentContext;
  }

  throw new Error(
    `Could not get tunnel for provider ${id}. Please provider a TunnelProvider with this ID.`,
  );
};
