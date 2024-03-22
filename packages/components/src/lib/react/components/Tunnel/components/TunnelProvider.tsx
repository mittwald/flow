import React, { FC, PropsWithChildren } from "react";
import tunnelContext from "@/lib/react/components/Tunnel/context";
import { useSignal } from "@preact/signals-react";

export const TunnelProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <tunnelContext.Provider
      value={{
        nodes: useSignal({}),
      }}
    >
      {children}
    </tunnelContext.Provider>
  );
};

export default TunnelProvider;
