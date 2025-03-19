import type { RemoteConnection } from "@mfalkenberg/remote-dom-core";
import type { ExtBridgeRemoteApi } from "@mittwald/ext-bridge";

export interface HostExports extends ExtBridgeRemoteApi {
  setIsReady: () => Promise<void>;
}

export interface RemoteExports {
  render: (connection: RemoteConnection) => Promise<void>;
}
