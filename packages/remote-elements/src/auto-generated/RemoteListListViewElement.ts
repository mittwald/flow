/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { ListProps as RemoteListListViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { ListProps as RemoteListListViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListListViewElement extends FlowRemoteElement<RemoteListListViewElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {};
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
    "flr-list-list-view": InstanceType<typeof RemoteListListViewElement>;
  }
}

customElements.define("flr-list-list-view", RemoteListListViewElement);
