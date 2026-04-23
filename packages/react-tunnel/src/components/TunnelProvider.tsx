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

  const parentContext = useContext(tunnelContext);

  return (
    <tunnelContext.Provider
      value={{
        state: TunnelState.useNew(id),
        parentContext: parentContext,
      }}
    >
      {children}
    </tunnelContext.Provider>
  );
};

export default TunnelProvider;
