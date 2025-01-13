/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { ContextMenuTriggerProps as RemoteContextMenuTriggerElementProps } from "@mittwald/flow-react-components/ContextMenu";
export type { ContextMenuTriggerProps as RemoteContextMenuTriggerElementProps } from "@mittwald/flow-react-components/ContextMenu";

export class RemoteContextMenuTriggerElement extends FlowRemoteElement<RemoteContextMenuTriggerElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      controller: {},
      isDefaultOpen: {},
    };
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-context-menu-trigger": InstanceType<
      typeof RemoteContextMenuTriggerElement
    >;
  }
}

customElements.define(
  "flr-context-menu-trigger",
  RemoteContextMenuTriggerElement,
);
