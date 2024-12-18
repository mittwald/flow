/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { AlertBadgeProps } from "@mittwald/flow-react-components/AlertBadge";
export type { AlertBadgeProps } from "@mittwald/flow-react-components/AlertBadge";

export const RemoteAlertBadgeElement = createRemoteElement<AlertBadgeProps>({
  properties: {
    children: {},
    status: {},
    wrapWith: {},
    className: {},
    ref: {},
    key: {},
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-alert-badge": InstanceType<typeof RemoteAlertBadgeElement>;
  }
}

customElements.define("flr-alert-badge", RemoteAlertBadgeElement);
