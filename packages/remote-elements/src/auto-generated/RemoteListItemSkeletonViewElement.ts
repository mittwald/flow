/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ListItemSkeletonViewProps as RemoteListItemSkeletonViewElementProps } from "@mittwald/flow-react-components";
export type { ListItemSkeletonViewProps as RemoteListItemSkeletonViewElementProps } from "@mittwald/flow-react-components";

export class RemoteListItemSkeletonViewElement extends FlowRemoteElement<RemoteListItemSkeletonViewElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      viewMode: {},
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
    "flr-list-item-skeleton-view": InstanceType<
      typeof RemoteListItemSkeletonViewElement
    >;
  }
}

customElements.define(
  "flr-list-item-skeleton-view",
  RemoteListItemSkeletonViewElement,
);
