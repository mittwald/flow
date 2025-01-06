import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export class RemoteListPaginationInfosElement extends FlowRemoteElement {
  static get remoteProperties() {
    return {
      totalItemsCount: {},
      visibleItemsCount: {},
      isInitiallyLoading: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-pagination-infos": InstanceType<
      typeof RemoteListPaginationInfosElement
    >;
  }
}

customElements.define(
  "flr-list-pagination-infos",
  RemoteListPaginationInfosElement,
);
