import type { ExtBridgeConnectionApi } from "@mittwald/ext-bridge";
import type { RemoteConnection } from "@mittwald/remote-dom-core";
import type { ThreadIframe, ThreadNestedIframe } from "@quilted/threads";
export type { RemoteConnection } from "@mittwald/remote-dom-core";

export interface NavigationState {
  pathname: string;
  isPending: boolean;
}

export interface HostExports extends ExtBridgeConnectionApi {
  setIsReady: (version?: Version) => Promise<void>;
  setIsLoading: (isLoading: boolean) => Promise<void>;
  setError: (error: string) => Promise<void>;
  setNavigationState: (state: NavigationState) => Promise<void>;
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
