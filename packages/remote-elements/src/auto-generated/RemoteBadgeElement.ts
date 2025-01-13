/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { BadgeProps as RemoteBadgeElementProps } from "@mittwald/flow-react-components/Badge";
export type { BadgeProps as RemoteBadgeElementProps } from "@mittwald/flow-react-components/Badge";

export class RemoteBadgeElement extends FlowRemoteElement<RemoteBadgeElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      color: {},
      isDisabled: {},
    };
  }

  static get remoteEvents() {
    return {
      close: {},
      press: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-badge": InstanceType<typeof RemoteBadgeElement>;
  }
}

customElements.define("flr-badge", RemoteBadgeElement);
