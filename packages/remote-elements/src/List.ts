import { createRemoteElement } from "@remote-dom/core/elements";
export type { ListProps } from "@mittwald/flow-react-components/List";

export const RemoteListElement = createRemoteElement({});

declare global {
  interface HTMLElementTagNameMap {
    "flr-list": InstanceType<typeof RemoteListElement>;
  }
}

customElements.define("flr-list", RemoteListElement);
