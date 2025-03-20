import type { config } from "@/config/schemas";
import type { z } from "zod";

export type ExtBridgeConfig = z.infer<typeof config>;
