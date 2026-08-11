import type { RemoteExtBridgeConnectionApi } from "@/connection";
import type { ExtBridgeConfigInput, HostConfig } from "@mittwald/ext-bridge";

export const getWithMergedHostConfig =
  (extBridgeConnection: RemoteExtBridgeConnectionApi, hostConfig: HostConfig) =>
  async (): Promise<ExtBridgeConfigInput> => {
    const baseConfig = await extBridgeConnection.getConfig();

    return {
      ...hostConfig,
      ...baseConfig,
    };
  };
