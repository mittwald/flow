import { Version } from "@mittwald/flow-remote-core";

/** The protocol version this package speaks — what the host negotiates against. */
export const communicationVersion = Version.v5;

/*
 * Reported to the host for diagnostics only. Vite's `define` injects it for dev
 * and test; `svelte-package` has no such step, so the published files fall back.
 * `typeof` on an undeclared identifier is safe — a bare reference would throw.
 *
 * Before this package ships, the build has to inject the real version (a
 * generated module, or a `replace` step in front of `svelte-package`).
 */
export const packageVersion =
  typeof __FLOW_REMOTE_SVELTE_COMPONENTS_PACKAGE_VERSION__ === "string"
    ? __FLOW_REMOTE_SVELTE_COMPONENTS_PACKAGE_VERSION__
    : "0.0.0";

export const version = communicationVersion;
