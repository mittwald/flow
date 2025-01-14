/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { PaginationInfosProps as RemoteListPaginationInfosViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { PaginationInfosProps as RemoteListPaginationInfosViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListPaginationInfosViewElement extends FlowRemoteElement<RemoteListPaginationInfosViewElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      isInitiallyLoading: {},
      totalItemsCount: {},
      visibleItemsCount: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
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
