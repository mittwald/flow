import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export class RemoteListItemViewElement extends FlowRemoteElement {
  static get remoteEvents() {
    return {};
  }
  static get remoteProperties() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-item-view": InstanceType<typeof RemoteListItemViewElement>;
  }
}

customElements.define("flr-list-item-view", RemoteListItemViewElement);
