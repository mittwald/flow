import { createRemoteElement } from "@remote-dom/core/elements";

export const RemoteListItemElement = createRemoteElement({});

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-item": InstanceType<typeof RemoteListItemElement>;
  }
}

customElements.define("flr-list-item", RemoteListItemElement);
