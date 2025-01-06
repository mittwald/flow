/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { BadgeProps } from "@mittwald/flow-react-components/Badge";
export type { BadgeProps } from "@mittwald/flow-react-components/Badge";

export class RemoteBadgeElement extends FlowRemoteElement<BadgeProps> {
  static get remoteProperties() {
    return {
      color: {},
      isDisabled: {},
      children: {},
      wrapWith: {},
      className: {},
    };
  }

  static get remoteEvents() {
    return {
      press: {},
      close: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-badge": InstanceType<typeof RemoteBadgeElement>;
  }
}

customElements.define("flr-badge", RemoteBadgeElement);
