/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { AlertBadgeProps } from "@mittwald/flow-react-components/AlertBadge";
export type { AlertBadgeProps } from "@mittwald/flow-react-components/AlertBadge";

export class RemoteAlertBadgeElement extends FlowRemoteElement<AlertBadgeProps> {
  static get remoteProperties() {
    return {
      children: {},
      status: {},
      wrapWith: {},
      className: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-alert-badge": InstanceType<typeof RemoteAlertBadgeElement>;
  }
}

customElements.define("flr-alert-badge", RemoteAlertBadgeElement);
