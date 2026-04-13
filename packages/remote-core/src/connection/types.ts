import type {
  ExtBridgeConfigInput,
  ExtBridgeConnectionApi,
} from "@mittwald/ext-bridge";
import type { HostConfig } from "@mittwald/flow-core";
import type { RemoteConnection } from "@mittwald/remote-dom-core";
import type { ThreadIframe, ThreadNestedIframe } from "@quilted/threads";
export type { RemoteConnection } from "@mittwald/remote-dom-core";

export interface NavigationState {
  pathname: string;
  isPending: boolean;
}

export type RemoteExtBridgeConfig = Exclude<
  ExtBridgeConfigInput,
  keyof HostConfig
>;

export interface RemoteExtBridgeConnectionApi extends Omit<
  ExtBridgeConnectionApi,
  "getConfig"
> {
  getConfig: () => Promise<RemoteExtBridgeConfig>;
}

/**
 * Breaking Change warning: Do not remove/rename/modify existing properties of
 * this interface, as they might be used by existing extensions.
 *
 * When addding properties, make sure to release the host before all clients.
 */
export interface HostExports extends RemoteExtBridgeConnectionApi {
  setIsReady: (version?: Version) => Promise<void>;
  setIsLoading: (isLoading: boolean) => Promise<void>;
  setError: (error: string) => Promise<void>;
  setNavigationState: (state: NavigationState) => Promise<void>;
  getHostConfig: () => Promise<HostConfig>;
}

export interface RemoteExports {
  render: (connection: RemoteConnection) => Promise<void>;
  setPathname: (pathname: string) => Promise<void>;
}

export type RemoteToHostConnection = ThreadNestedIframe<
  HostExports,
  RemoteExports
>;

export interface HostToRemoteConnection {
  version: Version;
  thread: ThreadIframe<RemoteExports, HostExports>;
  updateHostPathname: (hostPathname?: string) => void;
}

export enum Version {
  vUnknown = 0,
  v1 = 1,
  v2 = 2,
  v3 = 3,
}
