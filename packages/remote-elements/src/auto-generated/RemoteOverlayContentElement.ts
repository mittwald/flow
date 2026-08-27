/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { OverlayContentProps } from "@mittwald/flow-react-components";
export type RemoteOverlayContentElementProps =
  WithSerializableClassName<OverlayContentProps>;

export class RemoteOverlayContentElement extends FlowRemoteElement<RemoteOverlayContentElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-labelledby": {},
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
