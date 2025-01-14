/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { FilterPickerProps as RemoteListFilterPickerViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { FilterPickerProps as RemoteListFilterPickerViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListFilterPickerViewElement extends FlowRemoteElement<RemoteListFilterPickerViewElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      selectedKeys: {},
      selectionMode: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return ["buttonText"];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-filter-picker-view": InstanceType<
      typeof RemoteListFilterPickerViewElement
    >;
  }
}

customElements.define(
  "flr-list-filter-picker-view",
  RemoteListFilterPickerViewElement,
);
