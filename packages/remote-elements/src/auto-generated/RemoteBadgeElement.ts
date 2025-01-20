/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { BadgeProps as RemoteBadgeElementProps } from "@mittwald/flow-react-components/Badge";
export type { BadgeProps as RemoteBadgeElementProps } from "@mittwald/flow-react-components/Badge";

export class RemoteBadgeElement extends FlowRemoteElement<RemoteBadgeElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      color: {},
      isDisabled: {},
    };
  }

  static override get remoteEvents() {
    return {
      close: {},
      press: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-badge": InstanceType<typeof RemoteBadgeElement>;
  }
}

customElements.define("flr-badge", RemoteBadgeElement);
