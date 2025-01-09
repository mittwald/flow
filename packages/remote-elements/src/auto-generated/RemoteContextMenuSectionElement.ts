/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContextMenuSectionProps as RemoteContextMenuSectionElementProps } from "@mittwald/flow-react-components/ContextMenu";
export type { ContextMenuSectionProps as RemoteContextMenuSectionElementProps } from "@mittwald/flow-react-components/ContextMenu";

export class RemoteContextMenuSectionElement extends FlowRemoteElement<RemoteContextMenuSectionElementProps> {
  static get remoteProperties() {
    return {
      selectionMode: {},
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
    "flr-context-menu-section": InstanceType<
      typeof RemoteContextMenuSectionElement
    >;
  }
}

customElements.define(
  "flr-context-menu-section",
  RemoteContextMenuSectionElement,
);
