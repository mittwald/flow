/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LightBoxTriggerProps as RemoteLightBoxTriggerElementProps } from "@mittwald/flow-react-components";
export type { LightBoxTriggerProps as RemoteLightBoxTriggerElementProps } from "@mittwald/flow-react-components";

export class RemoteLightBoxTriggerElement extends FlowRemoteElement<RemoteLightBoxTriggerElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      isDefaultOpen: {},
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
    "flr-light-box-trigger": InstanceType<typeof RemoteLightBoxTriggerElement>;
  }
}

customElements.define("flr-light-box-trigger", RemoteLightBoxTriggerElement);
