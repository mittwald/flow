/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ActionProps } from "@mittwald/flow-react-components/Action";
export type { ActionProps } from "@mittwald/flow-react-components/Action";

export class RemoteActionElement extends FlowRemoteElement<ActionProps> {
  static get remoteProperties() {
    return {
      action: {},
      actionModel: {},
      closeOverlay: {},
      openOverlay: {},
      toggleOverlay: {},
      break: {},
      skip: {},
      showFeedback: {},
      children: {},
      wrapWith: {},
    };
  }

  static get remoteEvents() {
    return {
      action: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-action": InstanceType<typeof RemoteActionElement>;
  }
}

customElements.define("flr-action", RemoteActionElement);
