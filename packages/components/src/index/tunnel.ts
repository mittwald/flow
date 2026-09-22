/**
 * The `@mittwald/react-tunnel` API, re-exported so consumers render through the
 * very module instance Flow uses. Its context is module-level, so a second copy
 * of the package — which a consumer's own dependency on it produces as soon as
 * the versions diverge — is a second context, and entries no longer find Flow's
 * providers.
 */

export {
  TunnelProvider,
  type TunnelProviderProps,
  TunnelExit,
  type TunnelExitProps,
  type TunnelExitChildren,
  type TunnelEntryChildren,
} from "@mittwald/react-tunnel";

/** The same `TunnelEntry` the main entry point exports, not react-tunnel's. */
export { TunnelEntry, type TunnelEntryProps } from "@/components/TunnelEntry";

export { getTunnelProviderId } from "@/components/UiComponentTunnel/lib";
export type { FlowComponentName } from "@/components/propTypes/types";
