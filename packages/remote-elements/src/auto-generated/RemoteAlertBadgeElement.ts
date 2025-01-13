/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { AlertBadgeProps as RemoteAlertBadgeElementProps } from "@mittwald/flow-react-components/AlertBadge";
export type { AlertBadgeProps as RemoteAlertBadgeElementProps } from "@mittwald/flow-react-components/AlertBadge";

export class RemoteAlertBadgeElement extends FlowRemoteElement<RemoteAlertBadgeElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      status: {},
    };
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
    "flr-alert-badge": InstanceType<typeof RemoteAlertBadgeElement>;
  }
}

customElements.define("flr-alert-badge", RemoteAlertBadgeElement);
