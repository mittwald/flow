/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { SortingPickerProps as RemoteListSortingPickerViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { SortingPickerProps as RemoteListSortingPickerViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListSortingPickerViewElement extends FlowRemoteElement<RemoteListSortingPickerViewElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      buttonText: {},
      selectedKeys: {},
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
    "flr-list-sorting-picker-view": InstanceType<
      typeof RemoteListSortingPickerViewElement
    >;
  }
}

customElements.define(
  "flr-list-sorting-picker-view",
  RemoteListSortingPickerViewElement,
);
