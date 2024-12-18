import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export type { ListProps } from "@mittwald/flow-react-components/List";

export class RemoteListFilterPickerElement extends FlowRemoteElement {
  static get remoteEvents() {
    return {
      change: {},
    };
  }
  static get remoteSlots() {
    return ["buttonText"];
  }
  static get remoteProperties() {
    return {
      selectedKeys: {},
      selectionMode: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-filter-picker": InstanceType<
      typeof RemoteListFilterPickerElement
    >;
  }
}

customElements.define("flr-list-filter-picker", RemoteListFilterPickerElement);
