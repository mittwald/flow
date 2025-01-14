/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { LoadingSpinnerProps as RemoteLoadingSpinnerElementProps } from "@mittwald/flow-react-components/LoadingSpinner";
export type { LoadingSpinnerProps as RemoteLoadingSpinnerElementProps } from "@mittwald/flow-react-components/LoadingSpinner";

export class RemoteLoadingSpinnerElement extends FlowRemoteElement<RemoteLoadingSpinnerElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {};
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-loading-spinner": InstanceType<typeof RemoteLoadingSpinnerElement>;
  }
}

customElements.define("flr-loading-spinner", RemoteLoadingSpinnerElement);
