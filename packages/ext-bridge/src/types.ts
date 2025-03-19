import type { ExtBridgeConfig } from "@/config/types";
import type { loadingApi } from "@/loading";
export type { ExtBridgeConfig } from "@/config/types";

type LoadingApi = typeof loadingApi;

export interface ExtBridgeRemoteApi {
  getSessionToken: () => Promise<string>;
  getConfig: () => Promise<ExtBridgeConfig>;
}

export interface ExtBridge extends ExtBridgeRemoteApi, LoadingApi {
  config: ExtBridgeConfig;
}

declare global {
  // eslint-disable-next-line no-var
  var mwExtBridge: ExtBridge;
}
