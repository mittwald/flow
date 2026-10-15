import { ActionFormDemo } from "@/app/remote-vue/_demos/actionForm";
import { ActionsDemo } from "@/app/remote-vue/_demos/components/actions";
import { ChatDemo } from "@/app/remote-vue/_demos/components/chat";
import { ContentDemo } from "@/app/remote-vue/_demos/components/content";
import { DataVisualisationDemo } from "@/app/remote-vue/_demos/components/data-visualisation";
import { FormControlsDemo } from "@/app/remote-vue/_demos/components/form-controls";
import { ListComponentsDemo } from "@/app/remote-vue/_demos/components/list";
import { NavigationComponentsDemo } from "@/app/remote-vue/_demos/components/navigation";
import { OverlaysDemo } from "@/app/remote-vue/_demos/components/overlays";
import { StatusDemo } from "@/app/remote-vue/_demos/components/status";
import { StructureDemo } from "@/app/remote-vue/_demos/components/structure";
import { UploadDemo } from "@/app/remote-vue/_demos/components/upload";
import { ErrorDemo } from "@/app/remote-vue/_demos/error";
import { EventHandlerDemo } from "@/app/remote-vue/_demos/eventHandler";
import { ExtBridgeDemo } from "@/app/remote-vue/_demos/extBridge";
import { FilesDemo } from "@/app/remote-vue/_demos/files";
import { MStudioLoadingDemo } from "@/app/remote-vue/_demos/mstudioLoading";
import {
  NavigationDemo,
  NavigationSubpageDemo,
} from "@/app/remote-vue/_demos/navigation";
import { NoComponentDemo } from "@/app/remote-vue/_demos/noComponent";
import { NonInteractiveDemo } from "@/app/remote-vue/_demos/nonInteractive";
import { PerformanceDemo } from "@/app/remote-vue/_demos/performance";
import { SimpleFormDemo } from "@/app/remote-vue/_demos/simpleForm";
import { SuspenseDemo } from "@/app/remote-vue/_demos/suspense";
import { TunnelDemo } from "@/app/remote-vue/_demos/tunnel";
import type { Component } from "vue";

/**
 * The demo pages that exist as a Vue remote app, keyed by the same slug the
 * React pages use under `/remote`. Anything not listed here falls back to
 * `NotPortedDemo`.
 */
export const vueDemos: Record<string, Component> = {
  "action-form": ActionFormDemo,
  "components/actions": ActionsDemo,
  "components/chat": ChatDemo,
  "components/content": ContentDemo,
  "components/data-visualisation": DataVisualisationDemo,
  "components/form-controls": FormControlsDemo,
  "components/list": ListComponentsDemo,
  "components/navigation": NavigationComponentsDemo,
  "components/overlays": OverlaysDemo,
  "components/status": StatusDemo,
  "components/structure": StructureDemo,
  "components/upload": UploadDemo,
  error: ErrorDemo,
  "event-handler": EventHandlerDemo,
  "ext-bridge": ExtBridgeDemo,
  files: FilesDemo,
  "mstudio-loading": MStudioLoadingDemo,
  navigation: NavigationDemo,
  "navigation/subpage": NavigationSubpageDemo,
  "no-component": NoComponentDemo,
  "non-interactive": NonInteractiveDemo,
  performance: PerformanceDemo,
  "simple-form": SimpleFormDemo,
  suspense: SuspenseDemo,
  tunnel: TunnelDemo,
};
