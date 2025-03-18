import type { RemoteConnection } from "@mfalkenberg/remote-dom-core";
import type { ExtBridgeFunctions } from "@mittwald/ext-bridge";

export type HostExports = ExtBridgeFunctions;

export interface RemoteExports {
  render: (connection: RemoteConnection) => Promise<void>;
}
