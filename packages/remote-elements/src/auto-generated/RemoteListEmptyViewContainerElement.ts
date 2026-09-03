/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { EmptyViewContainerProps as RemoteListEmptyViewContainerElementProps } from "@mittwald/flow-react-components";
export type { EmptyViewContainerProps as RemoteListEmptyViewContainerElementProps } from "@mittwald/flow-react-components";

export class RemoteListEmptyViewContainerElement extends FlowRemoteElement<RemoteListEmptyViewContainerElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      viewType: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return ["emptySearchResultView", "emptyView"];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-empty-view-container": InstanceType<
      typeof RemoteListEmptyViewContainerElement
    >;
  }
}

customElements.define(
  "flr-list-empty-view-container",
  RemoteListEmptyViewContainerElement,
);
