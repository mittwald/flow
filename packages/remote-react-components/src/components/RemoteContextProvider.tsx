import type { RemoteToHostConnection } from "@mittwald/flow-remote-core";
import { createContext, useContext } from "react";

interface RemoteContext {
  connection: RemoteToHostConnection;
}

const remoteContext = createContext<RemoteContext | null>(null);

export const RemoteContextProvider = remoteContext.Provider;

export const useRemoteContext = () => {
  const context = useContext(remoteContext);
  if (!context) {
    throw new Error(
      "useRemoteContext must be used within a RemoteContextProvider",
    );
  }
  return context;
};
