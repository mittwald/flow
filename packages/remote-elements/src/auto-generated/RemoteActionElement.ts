/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ActionProps as RemoteActionElementProps } from "@mittwald/flow-react-components/Action";
export type { ActionProps as RemoteActionElementProps } from "@mittwald/flow-react-components/Action";

export class RemoteActionElement extends FlowRemoteElement<RemoteActionElementProps> {
  static get remoteProperties() {
    return {
      action: {},
      actionModel: {},
      break: {},
      closeOverlay: {},
      openOverlay: {},
      showFeedback: {},
      skip: {},
      toggleOverlay: {},
    };
  }

  static get remoteEvents() {
    return {
      action: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-action": InstanceType<typeof RemoteActionElement>;
  }
}

customElements.define("flr-action", RemoteActionElement);
