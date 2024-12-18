import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export class RemoteListItemElement extends FlowRemoteElement {
  static get remoteEvents() {
    return {
      action: {},
    };
  }
  static get remoteProperties() {
    return {
      id: {},
      textValue: {},
      href: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-item": InstanceType<typeof RemoteListItemElement>;
  }
}

customElements.define("flr-list-item", RemoteListItemElement);
