import type { LoadingApi } from "@/loading";
import type { SessionToken } from "@/sessionToken/types";

export type ContextParameters = Record<string, string>;

export interface ExtBridgeFunctions {
  getSessionToken: () => Promise<SessionToken>;
  getContextParameters: () => Promise<ContextParameters>;
}

export type ExtBridge = ExtBridgeFunctions & LoadingApi;

declare global {
  // eslint-disable-next-line no-var
  var mwExtBridge: ExtBridge;
}
