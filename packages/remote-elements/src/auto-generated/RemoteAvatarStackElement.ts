/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { AvatarStackProps as RemoteAvatarStackElementProps } from "@mittwald/flow-react-components";
export type { AvatarStackProps as RemoteAvatarStackElementProps } from "@mittwald/flow-react-components";

export class RemoteAvatarStackElement extends FlowRemoteElement<RemoteAvatarStackElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      size: {},
      totalCount: {},
    };
  }

  static override get remoteEvents() {
    return {
      countPress: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-avatar-stack": InstanceType<typeof RemoteAvatarStackElement>;
  }
}

customElements.define("flr-avatar-stack", RemoteAvatarStackElement);
