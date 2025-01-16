/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { TabsProps as RemoteTabsElementProps } from "@mittwald/flow-react-components/Tabs";
export type { TabsProps as RemoteTabsElementProps } from "@mittwald/flow-react-components/Tabs";

export class RemoteTabsElement extends FlowRemoteElement<RemoteTabsElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      className: {},
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

  static override get remoteEvents() {
    return {
      selectionChange: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-tabs": InstanceType<typeof RemoteTabsElement>;
  }
}

customElements.define("flr-tabs", RemoteTabsElement);
