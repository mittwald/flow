/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { FilterPickerMenuItemProps as RemoteListFilterPickerMenuItemViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { FilterPickerMenuItemProps as RemoteListFilterPickerMenuItemViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListFilterPickerMenuItemViewElement extends FlowRemoteElement<RemoteListFilterPickerMenuItemViewElementProps> {
  static get remoteProperties() {
    return {
      id: {},
    };
  }

  static get remoteEvents() {
    return {
      action: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-filter-picker-menu-item-view": InstanceType<
      typeof RemoteListFilterPickerMenuItemViewElement
    >;
  }
}

customElements.define(
  "flr-list-filter-picker-menu-item-view",
  RemoteListFilterPickerMenuItemViewElement,
);
