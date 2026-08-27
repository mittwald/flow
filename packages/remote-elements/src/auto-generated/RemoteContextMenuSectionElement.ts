/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { ContextMenuSectionProps } from "@mittwald/flow-react-components";
export type RemoteContextMenuSectionElementProps =
  WithSerializableClassName<ContextMenuSectionProps>;

export class RemoteContextMenuSectionElement extends FlowRemoteElement<RemoteContextMenuSectionElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      defaultSelectedKeys: {},
      selectedKeys: {},
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
