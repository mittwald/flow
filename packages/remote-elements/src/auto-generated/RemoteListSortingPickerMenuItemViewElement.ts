/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { SortingPickerMenuItemProps as RemoteListSortingPickerMenuItemViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { SortingPickerMenuItemProps as RemoteListSortingPickerMenuItemViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListSortingPickerMenuItemViewElement extends FlowRemoteElement<RemoteListSortingPickerMenuItemViewElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      id: {},
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
    "flr-list-sorting-picker-menu-item-view": InstanceType<
      typeof RemoteListSortingPickerMenuItemViewElement
    >;
  }
}

customElements.define(
  "flr-list-sorting-picker-menu-item-view",
  RemoteListSortingPickerMenuItemViewElement,
);
