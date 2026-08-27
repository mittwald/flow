/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { ListItemViewContentProps } from "@mittwald/flow-react-components";
export type RemoteListItemViewContentElementProps =
  WithSerializableClassName<ListItemViewContentProps>;

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
