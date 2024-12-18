/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { AvatarProps } from "@mittwald/flow-react-components/Avatar";
export type { AvatarProps } from "@mittwald/flow-react-components/Avatar";

export const RemoteAvatarElement = createRemoteElement<AvatarProps>({
  properties: {
    size: {},
    color: {},
    children: {},
    className: {},
    wrapWith: {},
    ref: {},
    key: {},
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-avatar": InstanceType<typeof RemoteAvatarElement>;
  }
}

customElements.define("flr-avatar", RemoteAvatarElement);
