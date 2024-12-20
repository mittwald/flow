import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export class RemoteListItemsElement extends FlowRemoteElement {
  static get remoteProperties() {
    return {
      isLoading: {},
      isInitiallyLoading: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-items": InstanceType<typeof RemoteListItemsElement>;
  }
}

customElements.define("flr-list-items", RemoteListItemsElement);
