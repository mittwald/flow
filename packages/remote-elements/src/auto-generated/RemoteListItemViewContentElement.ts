/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ListItemViewContentProps as RemoteListItemViewContentElementProps } from "@mittwald/flow-react-components";
export type { ListItemViewContentProps as RemoteListItemViewContentElementProps } from "@mittwald/flow-react-components";

export class RemoteListItemViewContentElement extends FlowRemoteElement<RemoteListItemViewContentElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      l: {},
      m: {},
      s: {},
      viewMode: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return ["avatar", "bottom", "button", "checkbox", "subTitle", "title"];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-item-view-content": InstanceType<
      typeof RemoteListItemViewContentElement
    >;
  }
}

customElements.define(
  "flr-list-item-view-content",
  RemoteListItemViewContentElement,
);
