import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export type { ListProps } from "@mittwald/flow-react-components/List";

export class RemoteListActiveFilterListElement extends FlowRemoteElement {
  static get remoteEvents() {
    return {
      resetFilters: {},
      clearFilters: {},
      storeFilterDefaultSettings: {},
    };
  }
  static get remoteProperties() {
    return {
      someFiltersChanged: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-active-filter-list": InstanceType<
      typeof RemoteListActiveFilterListElement
    >;
  }
}

customElements.define(
  "flr-list-active-filter-list",
  RemoteListActiveFilterListElement,
);
