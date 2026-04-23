import { useContext, type FC, type PropsWithChildren } from "react";
import tunnelContext from "@/context";
import { TunnelState } from "@/TunnelState";

export interface TunnelProviderProps extends PropsWithChildren {
  /**
   * Dedicated id for this tunnel provider. If not provided, the tunnel provider
   * will be registered as a global provider.
   */
  id?: string;
}

export const TunnelProvider: FC<TunnelProviderProps> = (props) => {
  const { children, id } = props;

  const parentState = useContext(tunnelContext);

  return (
    <tunnelContext.Provider
      value={TunnelState.useNew({ id, parentTunnelState: parentState })}
    >
      {children}
    </tunnelContext.Provider>
  );
};

export default TunnelProvider;
