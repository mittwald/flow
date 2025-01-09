/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ItemsProps as RemoteListItemsViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { ItemsProps as RemoteListItemsViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListItemsViewElement extends FlowRemoteElement<RemoteListItemsViewElementProps> {
  static get remoteProperties() {
    return {
      isLoading: {},
      isInitiallyLoading: {},
      "aria-labelledby": {},
      "aria-label": {},
      selectionBehavior: {},
      selectionMode: {},
      disallowEmptySelection: {},
      selectedKeys: {},
      defaultSelectedKeys: {},
      disabledKeys: {},
    };
  }

  static get remoteEvents() {
    return {
      selectionChange: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-items-view": InstanceType<typeof RemoteListItemsViewElement>;
  }
}

customElements.define("flr-list-items-view", RemoteListItemsViewElement);
