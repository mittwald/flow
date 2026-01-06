/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { InlineAlertProps as RemoteInlineAlertElementProps } from "@mittwald/flow-react-components";
export type { InlineAlertProps as RemoteInlineAlertElementProps } from "@mittwald/flow-react-components";

export class RemoteInlineAlertElement extends FlowRemoteElement<RemoteInlineAlertElementProps> {
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
    "flr-inline-alert": InstanceType<typeof RemoteInlineAlertElement>;
  }
}

customElements.define("flr-inline-alert", RemoteInlineAlertElement);
