/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { BadgeProps } from "@mittwald/flow-react-components";
export type RemoteBadgeElementProps = WithSerializableClassName<BadgeProps>;

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
