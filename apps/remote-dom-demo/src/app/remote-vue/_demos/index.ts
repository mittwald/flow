import { ActionFormDemo } from "@/app/remote-vue/_demos/actionForm";
import { ActivityDemo } from "@/app/remote-vue/_demos/activity";
import { ChartDemo } from "@/app/remote-vue/_demos/chart";
import { CodeEditorDemo } from "@/app/remote-vue/_demos/codeEditor";
import { ContextMenuDemo } from "@/app/remote-vue/_demos/contextMenu";
import { ErrorDemo } from "@/app/remote-vue/_demos/error";
import { EventHandlerDemo } from "@/app/remote-vue/_demos/eventHandler";
import { ExtBridgeDemo } from "@/app/remote-vue/_demos/extBridge";
import { FilesDemo } from "@/app/remote-vue/_demos/files";
import { ImageCropperDemo } from "@/app/remote-vue/_demos/imageCropper";
import { ListDemo } from "@/app/remote-vue/_demos/list";
import { MarkdownDemo } from "@/app/remote-vue/_demos/markdown";
import { ModalDemo } from "@/app/remote-vue/_demos/modal";
import { MStudioLoadingDemo } from "@/app/remote-vue/_demos/mstudioLoading";
import {
  NavigationDemo,
  NavigationSubpageDemo,
} from "@/app/remote-vue/_demos/navigation";
import { NoComponentDemo } from "@/app/remote-vue/_demos/noComponent";
import { NonInteractiveDemo } from "@/app/remote-vue/_demos/nonInteractive";
import { NotificationDemo } from "@/app/remote-vue/_demos/notification";
import { PerformanceDemo } from "@/app/remote-vue/_demos/performance";
import { PopoverDemo } from "@/app/remote-vue/_demos/popover";
import { RatingDemo } from "@/app/remote-vue/_demos/rating";
import { SimpleFormDemo } from "@/app/remote-vue/_demos/simpleForm";
import { SuspenseDemo } from "@/app/remote-vue/_demos/suspense";
import { SvgDemo } from "@/app/remote-vue/_demos/svg";
import { TabNavigationDemo } from "@/app/remote-vue/_demos/tabNavigation";
import { TunnelDemo } from "@/app/remote-vue/_demos/tunnel";
import type { Component } from "vue";

/**
 * The demo pages that exist as a Vue remote app, keyed by the same slug the
 * React pages use under `/remote`. Anything not listed here falls back to
 * `NotPortedDemo`.
 */
export const vueDemos: Record<string, Component> = {
  "action-form": ActionFormDemo,
  activity: ActivityDemo,
  chart: ChartDemo,
  "code-editor": CodeEditorDemo,
  "context-menu": ContextMenuDemo,
  error: ErrorDemo,
  "event-handler": EventHandlerDemo,
  "ext-bridge": ExtBridgeDemo,
  files: FilesDemo,
  "image-cropper": ImageCropperDemo,
  list: ListDemo,
  markdown: MarkdownDemo,
  modal: ModalDemo,
  "mstudio-loading": MStudioLoadingDemo,
  navigation: NavigationDemo,
  "navigation/subpage": NavigationSubpageDemo,
  "no-component": NoComponentDemo,
  "non-interactive": NonInteractiveDemo,
  notification: NotificationDemo,
  performance: PerformanceDemo,
  popover: PopoverDemo,
  rating: RatingDemo,
  "simple-form": SimpleFormDemo,
  suspense: SuspenseDemo,
  svg: SvgDemo,
  "tab-navigation": TabNavigationDemo,
  tunnel: TunnelDemo,
};
