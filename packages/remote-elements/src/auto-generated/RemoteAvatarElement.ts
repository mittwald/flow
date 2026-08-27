/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { AvatarProps } from "@mittwald/flow-react-components";
export type RemoteAvatarElementProps = WithSerializableClassName<AvatarProps>;

export class RemoteAvatarElement extends FlowRemoteElement<RemoteAvatarElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      color: {},
      label: {},
      size: {},
      status: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-avatar": InstanceType<typeof RemoteAvatarElement>;
  }
}

customElements.define("flr-avatar", RemoteAvatarElement);
