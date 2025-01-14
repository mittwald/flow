/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { AlertIconProps as RemoteAlertIconElementProps } from "@mittwald/flow-react-components/AlertIcon";
export type { AlertIconProps as RemoteAlertIconElementProps } from "@mittwald/flow-react-components/AlertIcon";

export class RemoteAlertIconElement extends FlowRemoteElement<RemoteAlertIconElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {};
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
    "flr-alert-icon": InstanceType<typeof RemoteAlertIconElement>;
  }
}

customElements.define("flr-alert-icon", RemoteAlertIconElement);
