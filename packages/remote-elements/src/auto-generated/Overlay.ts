/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { OverlayProps } from "@mittwald/flow-react-components/Overlay";
export type { OverlayProps } from "@mittwald/flow-react-components/Overlay";

export class RemoteOverlayElement extends FlowRemoteElement<OverlayProps> {
  static get remoteProperties() {
    return {
      controller: {},
      isDismissable: {},
      overlayType: {},
      children: {},
      className: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-overlay": InstanceType<typeof RemoteOverlayElement>;
  }
}

customElements.define("flr-overlay", RemoteOverlayElement);
