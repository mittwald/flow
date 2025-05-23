import type { Version } from "@mittwald/flow-remote-core";
import { createContext, useContext } from "react";

export interface RemoteRendererContext {
  remoteVersion: Version;
}

const remoteRendererContext = createContext<RemoteRendererContext | null>(null);

export const RemoteRendererContextProvider = remoteRendererContext.Provider;

export const useRemoteRendererContext = () => useContext(remoteRendererContext);
