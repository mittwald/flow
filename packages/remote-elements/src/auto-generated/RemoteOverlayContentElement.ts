/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { OverlayContentProps as RemoteOverlayContentElementProps } from "@mittwald/flow-react-components";
export type { OverlayContentProps as RemoteOverlayContentElementProps } from "@mittwald/flow-react-components";

export class RemoteOverlayContentElement extends FlowRemoteElement<RemoteOverlayContentElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      isDismissable: {},
      isOpen: {},
    };
  }

  static override get remoteEvents() {
    return {
      openChange: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-overlay-content": InstanceType<typeof RemoteOverlayContentElement>;
  }
}

customElements.define("flr-overlay-content", RemoteOverlayContentElement);
