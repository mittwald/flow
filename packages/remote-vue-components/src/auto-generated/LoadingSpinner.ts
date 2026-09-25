/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteLoadingSpinnerElement } from "@mittwald/flow-remote-elements";
import type { RemoteLoadingSpinnerElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteLoadingSpinnerElementProps as LoadingSpinnerProps } from "@mittwald/flow-remote-elements";

export const LoadingSpinner: FlowRemoteVueComponent<RemoteLoadingSpinnerElementProps> =
  createFlowRemoteComponent(
    "flr-loading-spinner",
    "LoadingSpinner",
    RemoteLoadingSpinnerElement,
    { booleans: ["suppressHydrationWarning"] },
  );
