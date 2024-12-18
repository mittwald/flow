/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { TabsProps } from "@mittwald/flow-react-components/Tabs";
export type { TabsProps } from "@mittwald/flow-react-components/Tabs";

export const RemoteTabsElement = createRemoteElement<TabsProps>({
  properties: {
    "aria-label": {},
    "aria-labelledby": {},
    "aria-describedby": {},
    "aria-details": {},
    className: {},
    style: {},
    isDisabled: {},
    id: {},
    slot: {},
    orientation: {},
    disabledKeys: {},
    selectedKey: {},
    defaultSelectedKey: {},
    keyboardActivation: {},
    children: {},
    wrapWith: {},
    ref: {},
    key: {},
  },
  events: {
    selectionChange: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-tabs": InstanceType<typeof RemoteTabsElement>;
  }
}

customElements.define("flr-tabs", RemoteTabsElement);
