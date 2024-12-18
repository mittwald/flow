import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export class RemoteListHeaderElement extends FlowRemoteElement {
  static get remoteSlots() {
    return ["filterPickerList", "activeFilterList"];
  }
  static get remoteProperties() {
    return {
      showSearch: {},
      searchValue: {},
    };
  }
  static get remoteEvents() {
    return {
      searchChanged: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-header": InstanceType<typeof RemoteListHeaderElement>;
  }
}

customElements.define("flr-list-header", RemoteListHeaderElement);
