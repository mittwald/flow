/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SuspenseTriggerProps as RemoteSuspenseTriggerElementProps } from "@mittwald/flow-react-components";
export type { SuspenseTriggerProps as RemoteSuspenseTriggerElementProps } from "@mittwald/flow-react-components";

export class RemoteSuspenseTriggerElement extends FlowRemoteElement<RemoteSuspenseTriggerElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      show: {},
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
    "flr-suspense-trigger": InstanceType<typeof RemoteSuspenseTriggerElement>;
  }
}

customElements.define("flr-suspense-trigger", RemoteSuspenseTriggerElement);
