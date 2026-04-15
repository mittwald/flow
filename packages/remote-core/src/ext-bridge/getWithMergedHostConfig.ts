import type { RemoteExtBridgeConnectionApi } from "@/connection";
import type { ExtBridgeConfigInput } from "@mittwald/ext-bridge";
import type { HostConfig } from "@mittwald/flow-core";

export const getWithMergedHostConfig =
  (extBridgeConnection: RemoteExtBridgeConnectionApi, hostConfig: HostConfig) =>
  async (): Promise<ExtBridgeConfigInput> => {
    const baseConfig = await extBridgeConnection.getConfig();

    return {
      ...hostConfig,
      ...baseConfig,
    };
  };
