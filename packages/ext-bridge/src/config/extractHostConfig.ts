import type { ExtBridgeConfigInput, HostConfig } from "./types";

export const extractHostConfig = (
  config: ExtBridgeConfigInput,
): HostConfig => ({
  language: config.language,
  theme: config.theme,
});
