/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { ListItemViewProps as RemoteListItemViewElementProps } from "@mittwald/flow-react-components/List";
export type { ListItemViewProps as RemoteListItemViewElementProps } from "@mittwald/flow-react-components/List";

export class RemoteListItemViewElement extends FlowRemoteElement<RemoteListItemViewElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {};
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
    "flr-list-item-view": InstanceType<typeof RemoteListItemViewElement>;
  }
}

customElements.define("flr-list-item-view", RemoteListItemViewElement);
