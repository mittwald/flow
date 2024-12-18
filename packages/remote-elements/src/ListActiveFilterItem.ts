import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export type { ListProps } from "@mittwald/flow-react-components/List";

export class RemoteListActiveFilterItemElement extends FlowRemoteElement {
  static get remoteEvents() {
    return {
      remove: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-active-filter-item": InstanceType<
      typeof RemoteListActiveFilterItemElement
    >;
  }
}

customElements.define(
  "flr-list-active-filter-item",
  RemoteListActiveFilterItemElement,
);
