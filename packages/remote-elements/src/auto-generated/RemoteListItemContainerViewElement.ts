/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { ItemContainerProps as RemoteListItemContainerViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { ItemContainerProps as RemoteListItemContainerViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListItemContainerViewElement extends FlowRemoteElement<RemoteListItemContainerViewElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      href: {},
      id: {},
      textValue: {},
    };
  }

  static override get remoteEvents() {
    return {
      action: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-item-container-view": InstanceType<
      typeof RemoteListItemContainerViewElement
    >;
  }
}

customElements.define(
  "flr-list-item-container-view",
  RemoteListItemContainerViewElement,
);
