/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { BadgeProps } from "@mittwald/flow-react-components/Badge";
export type { BadgeProps } from "@mittwald/flow-react-components/Badge";

export const RemoteBadgeElement = createRemoteElement<BadgeProps>({
  properties: {
    color: {},
    isDisabled: {},
    children: {},
    wrapWith: {},
    className: {},
    ref: {},
    key: {},
  },
  events: {
    press: {},
    close: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-badge": InstanceType<typeof RemoteBadgeElement>;
  }
}

customElements.define("flr-badge", RemoteBadgeElement);
