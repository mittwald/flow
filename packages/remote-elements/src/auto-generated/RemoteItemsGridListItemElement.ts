/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { GridListItemProps as RemoteItemsGridListItemElementProps } from "@mittwald/flow-react-components";
export type { GridListItemProps as RemoteItemsGridListItemElementProps } from "@mittwald/flow-react-components";

export class RemoteItemsGridListItemElement extends FlowRemoteElement<RemoteItemsGridListItemElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      download: {},
      hasAction: {},
      href: {},
      hrefLang: {},
      id: {},
      isDisabled: {},
      isTile: {},
      ping: {},
      referrerPolicy: {},
      rel: {},
      routerOptions: {},
      target: {},
      textValue: {},
      value: {},
    };
  }

  static override get remoteEvents() {
    return {
      action: {},
      hoverChange: {},
      hoverEnd: {},
      hoverStart: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-items-grid-list-item": InstanceType<
      typeof RemoteItemsGridListItemElement
    >;
  }
}

customElements.define(
  "flr-items-grid-list-item",
  RemoteItemsGridListItemElement,
);
