/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { GridListProps as RemoteItemsGridListElementProps } from "@mittwald/flow-react-components";
export type { GridListProps as RemoteItemsGridListElementProps } from "@mittwald/flow-react-components";

export class RemoteItemsGridListElement extends FlowRemoteElement<RemoteItemsGridListElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      className: {},
      defaultSelectedKeys: {},
      dependencies: {},
      disabledBehavior: {},
      disabledKeys: {},
      disallowEmptySelection: {},
      disallowTypeAhead: {},
      dragAndDropHooks: {},
      escapeKeyBehavior: {},
      id: {},
      items: {},
      keyboardNavigationBehavior: {},
      layout: {},
      renderEmptyState: {},
      selectedKeys: {},
      selectionBehavior: {},
      selectionMode: {},
      shouldSelectOnPressUp: {},
      slot: {},
    };
  }

  static override get remoteEvents() {
    return {
      action: {},
      scroll: {},
      selectionChange: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-items-grid-list": InstanceType<typeof RemoteItemsGridListElement>;
  }
}

customElements.define("flr-items-grid-list", RemoteItemsGridListElement);
