/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { AvatarProps } from "@mittwald/flow-react-components/Avatar";
export type { AvatarProps } from "@mittwald/flow-react-components/Avatar";

export class RemoteAvatarElement extends FlowRemoteElement<AvatarProps> {
  static get remoteProperties() {
    return {
      size: {},
      color: {},
      children: {},
      className: {},
      wrapWith: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-avatar": InstanceType<typeof RemoteAvatarElement>;
  }
}

customElements.define("flr-avatar", RemoteAvatarElement);
