/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { ListProps } from "@mittwald/flow-react-components/List";
export type { ListProps } from "@mittwald/flow-react-components/List";

export const RemoteListElement = createRemoteElement<ListProps>({
  properties: {
    batchSize: {},
    children: {},
    "aria-label": {},
    "aria-labelledby": {},
    selectedKeys: {},
    defaultSelectedKeys: {},
    disabledKeys: {},
    selectionMode: {},
    disallowEmptySelection: {},
    settingStorageKey: {},
    accordion: {},
    getItemId: {},
    defaultViewMode: {},
    selectionBehavior: {},
    ref: {},
    key: {},
  },
  events: {
    change: {},
    action: {},
    selectionChange: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-list": InstanceType<typeof RemoteListElement>;
  }
}

customElements.define("flr-list", RemoteListElement);
