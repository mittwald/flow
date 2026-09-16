export * from "./auto-generated";

/*
 * The Vue rebuilds of Flow's React-only surface (`flr-universal`). Those are
 * React compositions over remote elements rather than remote elements
 * themselves, so they cannot be generated — see this package's AGENTS.md.
 */
export * from "./components/Action";
export * from "./components/ActionBatch";
export * from "./components/BrowserOnly";
export * from "./components/CountryOptions";
export * from "./components/DeprecationWarningProvider";
export * from "./components/Form";
export * from "./components/LoadingIndicator";
export * from "./components/NotificationProvider";
export * from "./components/RemoteRoot";
export * from "./components/SettingsProvider";
export * from "./components/Wrap";
export * from "./overlays/LightBox";
export * from "./overlays/Modal";
export * from "./overlays/Popover";
export * from "./overlays/triggers";
export {
  createOverlayController,
  injectOverlayController,
  useOverlayController,
  type OverlayController,
  type UseOverlayControllerOptions,
} from "./overlays/overlayController";

export { useIsMounted } from "./composables/useIsMounted";
export { useOnChange } from "./composables/useOnChange";
export {
  useLanguage,
  useRemoteConnection,
  type RemoteContext,
} from "./composables/remoteContext";
export {
  createFlowRemoteComponent,
  type CreateFlowRemoteComponentOptions,
} from "./lib/createFlowRemoteComponent";
export type {
  FlowRemoteVueComponent,
  RemoteVueProps,
  RemoteVueSlots,
} from "./lib/types";
export { communicationVersion, packageVersion } from "./version";
