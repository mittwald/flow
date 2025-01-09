/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { PaginationInfosProps as RemoteListPaginationInfosViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { PaginationInfosProps as RemoteListPaginationInfosViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListPaginationInfosViewElement extends FlowRemoteElement<RemoteListPaginationInfosViewElementProps> {
  static get remoteProperties() {
    return {
      isInitiallyLoading: {},
      totalItemsCount: {},
      visibleItemsCount: {},
    };
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-pagination-infos-view": InstanceType<
      typeof RemoteListPaginationInfosViewElement
    >;
  }
}

customElements.define(
  "flr-list-pagination-infos-view",
  RemoteListPaginationInfosViewElement,
);
