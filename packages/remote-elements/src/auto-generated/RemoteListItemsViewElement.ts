/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { ItemsProps as RemoteListItemsViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { ItemsProps as RemoteListItemsViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListItemsViewElement extends FlowRemoteElement<RemoteListItemsViewElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      "aria-label": {},
      "aria-labelledby": {},
      defaultSelectedKeys: {},
      disabledKeys: {},
      disallowEmptySelection: {},
      isInitiallyLoading: {},
      isLoading: {},
      selectedKeys: {},
      selectionBehavior: {},
      selectionMode: {},
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
