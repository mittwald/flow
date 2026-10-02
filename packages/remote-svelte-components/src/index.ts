export * from "./auto-generated/index.js";

/*
 * The icon set, generated from the same `icons.yaml` as the React one — only
 * the default (Tabler) set, and the custom SVGs. FontAwesome is a Pro package
 * each consumer licenses itself and has no Svelte binding here.
 */
export * from "./icons/index.js";

/*
 * The Svelte rebuilds of Flow's React-only surface (`flr-universal`). Those are
 * React compositions over remote elements rather than remote elements
 * themselves, so they cannot be generated — see this package's AGENTS.md.
 */
export { default as Action, type ActionFn } from "./components/Action.svelte";
export { default as ActionBatch } from "./components/ActionBatch.svelte";
export { default as BrowserOnly } from "./components/BrowserOnly.svelte";
export {
  default as CountryOptions,
  type Country,
  type CountryFilterFn,
  type CountrySortFn,
} from "./components/CountryOptions.svelte";
export { default as DeprecationWarningProvider } from "./components/DeprecationWarningProvider.svelte";
export { default as Form } from "./components/Form.svelte";
export { default as IconSetProvider } from "./components/IconSetProvider.svelte";
export { default as IntlProvider } from "./components/IntlProvider.svelte";
export { default as LoadingIndicator } from "./components/LoadingIndicator.svelte";
export { default as NotificationProvider } from "./components/NotificationProvider.svelte";
export { default as RemoteRoot } from "./components/RemoteRoot.svelte";
export { default as SettingsProvider } from "./components/SettingsProvider.svelte";
export { default as Wrap } from "./components/Wrap.svelte";

export { default as LightBox } from "./overlays/LightBox.svelte";
export { default as Modal, type ModalSize } from "./overlays/Modal.svelte";
export { default as Popover } from "./overlays/Popover.svelte";

/*
 * One component under three names, the way Flow's three triggers are one
 * component with a different overlay next to it.
 */
export { default as LightBoxTrigger } from "./overlays/OverlayTrigger.svelte";
export { default as ModalTrigger } from "./overlays/OverlayTrigger.svelte";
export { default as PopoverTrigger } from "./overlays/OverlayTrigger.svelte";

export {
  createOverlayController,
  getSurroundingOverlayController,
  OverlayController,
  useOverlayController,
  type UseOverlayControllerOptions,
} from "./overlays/overlayController.svelte.js";
export {
  NotificationController,
  useNotificationController,
  type NotificationEntry,
  type NotificationOptions,
} from "./components/notificationController.svelte.js";
export {
  createSetting,
  localStorageBackend,
  useSetting,
  type Setting,
  type SettingsBackend,
} from "./components/settings.svelte.js";
export {
  useWarnDeprecation,
  type DeprecationWarningHandler,
} from "./lib/deprecation.js";
export { useIsMounted, useOnChange } from "./lib/lifecycle.svelte.js";
export {
  useContextIcon,
  type FlowIconComponent,
  type IconSet,
} from "./lib/iconSet.js";
export type { FlowIconName } from "./icons/iconNames.js";
export type { FlowIconProps } from "./lib/iconProps.js";
export {
  RemoteContext,
  useLanguage,
  useRemoteConnection,
  type ReactiveValue,
} from "./lib/remoteContext.svelte.js";

/*
 * The element wrapper and the props context are the package's own building
 * blocks, exported so an app can wrap a remote element the generator does not
 * cover, or configure a composition of its own.
 */
export { default as PropsContextProvider } from "./lib/PropsContextProvider.svelte";
export { default as RemoteElement } from "./lib/RemoteElement.svelte";
export {
  consumePropsContext,
  setPropsContext,
  type FlowPropsContext,
} from "./lib/propsContext.js";
export type { FlowRemoteProps, PropertiesOf } from "./lib/types.js";
export { communicationVersion, packageVersion } from "./version.js";
