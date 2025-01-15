/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { AlertBadgeProps as RemoteAlertBadgeElementProps } from "@mittwald/flow-react-components/AlertBadge";
export type { AlertBadgeProps as RemoteAlertBadgeElementProps } from "@mittwald/flow-react-components/AlertBadge";

export class RemoteAlertBadgeElement extends FlowRemoteElement<RemoteAlertBadgeElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
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
    "flr-alert-badge": InstanceType<typeof RemoteAlertBadgeElement>;
  }
}

customElements.define("flr-alert-badge", RemoteAlertBadgeElement);
