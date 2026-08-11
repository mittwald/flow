import type { config } from "@/config/schemas";
import type { z } from "zod";

/**
 * Configuration the mStudio host contributes to the extension config, on top of
 * the values parsed from the environment.
 *
 * Breaking Change warning: Do not remove/rename/modify existing properties of
 * this interface, as they might be used by existing extensions.
 *
 * When addding properties, make sure to release the host before all clients.
 */
export interface HostConfig {
  language: string;
  theme: "dark" | "light";
}

export type ExtBridgeConfig = z.infer<typeof config> & HostConfig;
export type ExtBridgeConfigInput = z.input<typeof config> & HostConfig;
