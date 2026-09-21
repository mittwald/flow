import ActionForm from "../_demos/ActionForm.svelte";
import Chart from "../_demos/Chart.svelte";
import CoachMark from "../_demos/CoachMark.svelte";
import CodeEditor from "../_demos/CodeEditor.svelte";
import ContextMenu from "../_demos/ContextMenu.svelte";
import ErrorDemo from "../_demos/ErrorDemo.svelte";
import EventHandler from "../_demos/EventHandler.svelte";
import ExtBridge from "../_demos/ExtBridge.svelte";
import Files from "../_demos/Files.svelte";
import Markdown from "../_demos/Markdown.svelte";
import Modal from "../_demos/Modal.svelte";
import MStudioLoading from "../_demos/MStudioLoading.svelte";
import Navigation from "../_demos/Navigation.svelte";
import NavigationSubpage from "../_demos/NavigationSubpage.svelte";
import NoComponent from "../_demos/NoComponent.svelte";
import NonInteractive from "../_demos/NonInteractive.svelte";
import Notification from "../_demos/Notification.svelte";
import Performance from "../_demos/Performance.svelte";
import Popover from "../_demos/Popover.svelte";
import Rating from "../_demos/Rating.svelte";
import SimpleForm from "../_demos/SimpleForm.svelte";
import Suspense from "../_demos/Suspense.svelte";
import Svg from "../_demos/Svg.svelte";
import TabNavigation from "../_demos/TabNavigation.svelte";
import Tunnel from "../_demos/Tunnel.svelte";

/**
 * The demo pages that exist as a Svelte remote app, keyed by the same slug the
 * React pages use under `/remote`. Anything not listed here falls back to
 * `NotPorted.svelte` — `list`, `list-selection` and `react-hook-form`, which
 * are the three that need something this package does not rebuild.
 */
export const demos = {
  "action-form": ActionForm,
  chart: Chart,
  "coach-mark": CoachMark,
  "code-editor": CodeEditor,
  "context-menu": ContextMenu,
  error: ErrorDemo,
  "event-handler": EventHandler,
  "ext-bridge": ExtBridge,
  files: Files,
  markdown: Markdown,
  modal: Modal,
  "mstudio-loading": MStudioLoading,
  navigation: Navigation,
  "navigation/subpage": NavigationSubpage,
  "no-component": NoComponent,
  "non-interactive": NonInteractive,
  notification: Notification,
  performance: Performance,
  popover: Popover,
  rating: Rating,
  "simple-form": SimpleForm,
  suspense: Suspense,
  svg: Svg,
  "tab-navigation": TabNavigation,
  tunnel: Tunnel,
};
