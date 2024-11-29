import { createRemoteElement } from "@remote-dom/core/elements";

export const RemoteListStaticDataElement = createRemoteElement({
  properties: ["data"],
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-static-data": InstanceType<typeof RemoteListStaticDataElement>;
  }
}

customElements.define("flr-list-static-data", RemoteListStaticDataElement);
