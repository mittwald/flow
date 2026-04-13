import type { HostConfig } from "@mittwald/flow-core";
import type { ExtBridgeConfigInput } from "./types";

export const extractHostConfig = (
  config: ExtBridgeConfigInput,
): HostConfig => ({
  language: config.language,
});
