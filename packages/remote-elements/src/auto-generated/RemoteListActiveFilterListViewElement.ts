/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ActiveFilterListProps as RemoteListActiveFilterListViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { ActiveFilterListProps as RemoteListActiveFilterListViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListActiveFilterListViewElement extends FlowRemoteElement<RemoteListActiveFilterListViewElementProps> {
  static get remoteProperties() {
    return {
      someFiltersChanged: {},
    };
  }

  static get remoteEvents() {
    return {
      clearFilters: {},
      resetFilters: {},
      storeFilterDefaultSettings: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-active-filter-list-view": InstanceType<
      typeof RemoteListActiveFilterListViewElement
    >;
  }
}

customElements.define(
  "flr-list-active-filter-list-view",
  RemoteListActiveFilterListViewElement,
);
