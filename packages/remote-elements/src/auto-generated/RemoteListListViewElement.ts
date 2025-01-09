/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ListProps as RemoteListListViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { ListProps as RemoteListListViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListListViewElement extends FlowRemoteElement<RemoteListListViewElementProps> {
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
    "flr-list-list-view": InstanceType<typeof RemoteListListViewElement>;
  }
}

customElements.define("flr-list-list-view", RemoteListListViewElement);
