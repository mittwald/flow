import React, { FC, PropsWithChildren } from "react";
import tunnelContext from "@/context";
import { TunnelState } from "@/TunnelState";

export const TunnelProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <tunnelContext.Provider value={TunnelState.useNew()}>
      {children}
    </tunnelContext.Provider>
  );
};

export default TunnelProvider;
