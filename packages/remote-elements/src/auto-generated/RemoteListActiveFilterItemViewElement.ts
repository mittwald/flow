/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { ActiveFilterItemProps as RemoteListActiveFilterItemViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { ActiveFilterItemProps as RemoteListActiveFilterItemViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListActiveFilterItemViewElement extends FlowRemoteElement<RemoteListActiveFilterItemViewElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {};
  }

  static override get remoteEvents() {
    return {
      remove: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-active-filter-item-view": InstanceType<
      typeof RemoteListActiveFilterItemViewElement
    >;
  }
}

customElements.define(
  "flr-list-active-filter-item-view",
  RemoteListActiveFilterItemViewElement,
);
