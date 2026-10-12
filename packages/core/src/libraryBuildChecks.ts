import type { InputOptions } from "rolldown";

/**
 * The `unplugin-dts` plugin runs `tsc` in its `buildStart` hook, so it owns
 * ~90% of the plugin time of every library build here. Rolldown's
 * plugin-timings check reports that on the builds slow enough to cross its
 * threshold — a fact with no action behind it (the declarations have to be
 * generated), and noise in every local and CI build log.
 */
export const libraryBuildChecks: InputOptions["checks"] = {
  pluginTimings: false,
};
