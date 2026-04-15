import type { ExtBridgeConfig, ExtBridgeConfigInput } from "@/config/types";
import type { readinessApi } from "@/readiness";
export type { ExtBridgeConfig, ExtBridgeConfigInput } from "@/config/types";

type ReadinessApi = typeof readinessApi;

export interface ExtBridgeConnectionApi {
  getSessionToken: () => Promise<string>;
  getConfig: () => Promise<ExtBridgeConfigInput>;
}

export interface ExtBridge {
  readiness: ReadinessApi;
  connection: ExtBridgeConnectionApi;
  config: ExtBridgeConfig;
}

declare global {
  var mwExtBridge: ExtBridge;
}
