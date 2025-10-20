import type { ExtBridgeConfig } from "@/config/types";
import type { readinessApi } from "@/readiness";
export type { ExtBridgeConfig } from "@/config/types";

type ReadinessApi = typeof readinessApi;

export interface ExtBridgeConnectionApi {
  getSessionToken: () => Promise<string>;
  getConfig: () => Promise<ExtBridgeConfig>;
}

export interface ExtBridge {
  readiness: ReadinessApi;
  connection: ExtBridgeConnectionApi;
  config: ExtBridgeConfig;
}

declare global {
  var mwExtBridge: ExtBridge;
}
