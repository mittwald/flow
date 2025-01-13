/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TabsProps as RemoteTabsElementProps } from "@mittwald/flow-react-components/Tabs";
export type { TabsProps as RemoteTabsElementProps } from "@mittwald/flow-react-components/Tabs";

export class RemoteTabsElement extends FlowRemoteElement<RemoteTabsElementProps> {
  static get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      defaultSelectedKey: {},
      disabledKeys: {},
      id: {},
      isDisabled: {},
      keyboardActivation: {},
      orientation: {},
      selectedKey: {},
      slot: {},
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
    "flr-tabs": InstanceType<typeof RemoteTabsElement>;
  }
}

customElements.define("flr-tabs", RemoteTabsElement);
