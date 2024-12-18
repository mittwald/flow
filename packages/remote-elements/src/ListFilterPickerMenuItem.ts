import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export type { ListProps } from "@mittwald/flow-react-components/List";

export class RemoteListFilterPickerMenuItemElement extends FlowRemoteElement {
  static get remoteEvents() {
    return {
      action: {},
    };
  }
  static get remoteProperties() {
    return {
      id: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-filter-picker-menu-item": InstanceType<
      typeof RemoteListFilterPickerMenuItemElement
    >;
  }
}

customElements.define(
  "flr-list-filter-picker-menu-item",
  RemoteListFilterPickerMenuItemElement,
);
