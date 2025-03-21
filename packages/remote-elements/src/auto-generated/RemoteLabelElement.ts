/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LabelProps as RemoteLabelElementProps } from "@mittwald/flow-react-components";
export type { LabelProps as RemoteLabelElementProps } from "@mittwald/flow-react-components";

export class RemoteLabelElement extends FlowRemoteElement<RemoteLabelElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      id: {},
      isDisabled: {},
      optional: {},
      slot: {},
      unstyled: {},
    };
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
    "flr-label": InstanceType<typeof RemoteLabelElement>;
  }
}

customElements.define("flr-label", RemoteLabelElement);
