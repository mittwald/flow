/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContextMenuContentProps as RemoteContextMenuContentElementProps } from "@mittwald/flow-react-components";
export type { ContextMenuContentProps as RemoteContextMenuContentElementProps } from "@mittwald/flow-react-components";

export class RemoteContextMenuContentElement extends FlowRemoteElement<RemoteContextMenuContentElementProps> {
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
      disabledKeys: {},
      disallowEmptySelection: {},
      escapeKeyBehavior: {},
      id: {},
      items: {},
      renderEmptyState: {},
      selectedKeys: {},
      selectionMode: {},
      shouldFocusWrap: {},
      slot: {},
    };
  }

  static override get remoteEvents() {
    return {
      action: {},
      close: {},
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
    "flr-context-menu-content": InstanceType<
      typeof RemoteContextMenuContentElement
    >;
  }
}

customElements.define(
  "flr-context-menu-content",
  RemoteContextMenuContentElement,
);
