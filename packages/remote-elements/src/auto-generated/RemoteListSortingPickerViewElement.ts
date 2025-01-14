/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { SortingPickerProps as RemoteListSortingPickerViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { SortingPickerProps as RemoteListSortingPickerViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListSortingPickerViewElement extends FlowRemoteElement<RemoteListSortingPickerViewElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      buttonText: {},
      selectedKeys: {},
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
    "flr-list-sorting-picker-view": InstanceType<
      typeof RemoteListSortingPickerViewElement
    >;
  }
}

customElements.define(
  "flr-list-sorting-picker-view",
  RemoteListSortingPickerViewElement,
);
