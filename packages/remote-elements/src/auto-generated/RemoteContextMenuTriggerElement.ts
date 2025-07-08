/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContextMenuTriggerProps as RemoteContextMenuTriggerElementProps } from "@mittwald/flow-react-components";
export type { ContextMenuTriggerProps as RemoteContextMenuTriggerElementProps } from "@mittwald/flow-react-components";

export class RemoteContextMenuTriggerElement extends FlowRemoteElement<RemoteContextMenuTriggerElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      isDefaultOpen: {},
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
    "flr-context-menu-trigger": InstanceType<
      typeof RemoteContextMenuTriggerElement
    >;
  }
}

customElements.define(
  "flr-context-menu-trigger",
  RemoteContextMenuTriggerElement,
);
