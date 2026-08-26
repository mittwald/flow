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

/**
 * Context parameters the host still supplies, but that should not be used any
 * more.
 *
 * The `@deprecated` tags live here and not on the schema shape in
 * `./schemas.ts`: JSDoc on a zod shape does not survive the declaration emit,
 * so a consumer of the published package would never see them.
 */
interface DeprecatedContextParameters {
  /** @deprecated Use `mailAddressId` instead. */
  emailAddressId?: string;
  /** @deprecated Use `domainId` instead. */
  ingressId?: string;
}

export type ExtBridgeConfig = z.infer<typeof config> &
  DeprecatedContextParameters &
  HostConfig;

export type ExtBridgeConfigInput = z.input<typeof config> & HostConfig;

/**
 * The config without the values the host contributes itself — what the host
 * receives from the extension environment over the wire.
 *
 * Deliberately not `Omit<ExtBridgeConfigInput, keyof HostConfig>`: the config
 * type carries an index signature for undeclared context parameters, and `Omit`
 * collapses such a type into that index signature alone, dropping every
 * declared property.
 */
export type ExtBridgeConfigInputWithoutHostConfig = z.input<typeof config>;
