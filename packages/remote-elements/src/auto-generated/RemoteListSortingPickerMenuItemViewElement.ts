/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { SortingPickerMenuItemProps as RemoteListSortingPickerMenuItemViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { SortingPickerMenuItemProps as RemoteListSortingPickerMenuItemViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListSortingPickerMenuItemViewElement extends FlowRemoteElement<RemoteListSortingPickerMenuItemViewElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      id: {},
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
    "flr-list-sorting-picker-menu-item-view": InstanceType<
      typeof RemoteListSortingPickerMenuItemViewElement
    >;
  }
}

customElements.define(
  "flr-list-sorting-picker-menu-item-view",
  RemoteListSortingPickerMenuItemViewElement,
);
