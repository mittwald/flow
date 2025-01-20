/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { ActionProps as RemoteActionElementProps } from "@mittwald/flow-react-components/Action";
export type { ActionProps as RemoteActionElementProps } from "@mittwald/flow-react-components/Action";

export class RemoteActionElement extends FlowRemoteElement<RemoteActionElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
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

  static override get remoteEvents() {
    return {
      action: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-action": InstanceType<typeof RemoteActionElement>;
  }
}

customElements.define("flr-action", RemoteActionElement);
