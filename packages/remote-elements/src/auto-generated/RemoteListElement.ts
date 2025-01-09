/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ListProps as RemoteListElementProps } from "@mittwald/flow-react-components/List";
export type { ListProps as RemoteListElementProps } from "@mittwald/flow-react-components/List";

export class RemoteListElement extends FlowRemoteElement<RemoteListElementProps> {
  static get remoteProperties() {
    return {
      batchSize: {},
      "aria-label": {},
      "aria-labelledby": {},
      selectedKeys: {},
      defaultSelectedKeys: {},
      disabledKeys: {},
      selectionMode: {},
      disallowEmptySelection: {},
      selectionBehavior: {},
      settingStorageKey: {},
      accordion: {},
      getItemId: {},
      defaultViewMode: {},
    };
  }

  static get remoteEvents() {
    return {
      change: {},
      action: {},
      selectionChange: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list": InstanceType<typeof RemoteListElement>;
  }
}

customElements.define("flr-list", RemoteListElement);
