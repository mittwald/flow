/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContextMenuSectionProps as RemoteContextMenuSectionElementProps } from "@mittwald/flow-react-components";
export type { ContextMenuSectionProps as RemoteContextMenuSectionElementProps } from "@mittwald/flow-react-components";

export class RemoteContextMenuSectionElement extends FlowRemoteElement<RemoteContextMenuSectionElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      defaultSelectedKeys: {},
      selectionMode: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
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
