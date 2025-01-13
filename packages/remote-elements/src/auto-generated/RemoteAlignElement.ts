/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { AlignProps as RemoteAlignElementProps } from "@mittwald/flow-react-components/Align";
export type { AlignProps as RemoteAlignElementProps } from "@mittwald/flow-react-components/Align";

export class RemoteAlignElement extends FlowRemoteElement<RemoteAlignElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {};
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-align": InstanceType<typeof RemoteAlignElement>;
  }
}

customElements.define("flr-align", RemoteAlignElement);
