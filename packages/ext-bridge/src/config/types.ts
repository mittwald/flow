import type { config } from "@/config/schemas";
import type { z } from "zod";
import type { HostConfig } from "@mittwald/flow-core";

export type ExtBridgeConfig = z.infer<typeof config> & HostConfig;
export type ExtBridgeConfigInput = z.input<typeof config> & HostConfig;
