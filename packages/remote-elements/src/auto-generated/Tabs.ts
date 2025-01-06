/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TabsProps } from "@mittwald/flow-react-components/Tabs";
export type { TabsProps } from "@mittwald/flow-react-components/Tabs";

export class RemoteTabsElement extends FlowRemoteElement<TabsProps> {
  static get remoteProperties() {
    return {
      isDisabled: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      id: {},
      className: {},
      style: {},
      slot: {},
      orientation: {},
      disabledKeys: {},
      selectedKey: {},
      defaultSelectedKey: {},
      keyboardActivation: {},
      children: {},
      wrapWith: {},
    };
  }

  static get remoteEvents() {
    return {
      selectionChange: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-tabs": InstanceType<typeof RemoteTabsElement>;
  }
}

customElements.define("flr-tabs", RemoteTabsElement);
