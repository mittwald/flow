/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { AvatarProps as RemoteAvatarElementProps } from "@mittwald/flow-react-components/Avatar";
export type { AvatarProps as RemoteAvatarElementProps } from "@mittwald/flow-react-components/Avatar";

export class RemoteAvatarElement extends FlowRemoteElement<RemoteAvatarElementProps> {
  static get remoteProperties() {
    return {
      color: {},
      size: {},
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
    "flr-avatar": InstanceType<typeof RemoteAvatarElement>;
  }
}

customElements.define("flr-avatar", RemoteAvatarElement);
