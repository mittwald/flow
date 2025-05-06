import type { ExtBridgeConnectionApi } from "@mittwald/ext-bridge";
import type { RemoteConnection } from "@mittwald/remote-dom-core";
import type { ThreadIframe, ThreadNestedIframe } from "@quilted/threads";

export interface NavigationState {
  pathname: string;
  isPending: boolean;
}

export interface HostExports extends ExtBridgeConnectionApi {
  setIsReady: () => Promise<void>;
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

export type HostToRemoteConnection = ThreadIframe<RemoteExports, HostExports>;
