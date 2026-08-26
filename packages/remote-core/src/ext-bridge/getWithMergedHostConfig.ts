import type { RemoteExtBridgeConnectionApi } from "@/connection";
import type { ExtBridgeConfigInput, HostConfig } from "@mittwald/ext-bridge";

export const getWithMergedHostConfig =
  (extBridgeConnection: RemoteExtBridgeConnectionApi, hostConfig: HostConfig) =>
  async (): Promise<ExtBridgeConfigInput> => {
    const baseConfig = await extBridgeConnection.getConfig();

    // Merged into a local first: the config type carries an index signature for
    // undeclared context parameters, and a spread checked directly against a
    // contextual type with an index signature loses the spread properties.
    const mergedConfig = {
      ...hostConfig,
      ...baseConfig,
    };

    return mergedConfig;
  };
