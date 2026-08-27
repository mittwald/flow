/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { AlertTextProps as RemoteAlertTextElementProps } from "@mittwald/flow-react-components";
export type { AlertTextProps as RemoteAlertTextElementProps } from "@mittwald/flow-react-components";

export class RemoteAlertTextElement extends FlowRemoteElement<RemoteAlertTextElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      status: {},
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
    "flr-alert-text": InstanceType<typeof RemoteAlertTextElement>;
  }
}

customElements.define("flr-alert-text", RemoteAlertTextElement);
