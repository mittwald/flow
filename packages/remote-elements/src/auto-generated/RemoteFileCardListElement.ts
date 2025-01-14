/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { FileCardListProps as RemoteFileCardListElementProps } from "@mittwald/flow-react-components/FileCardList";
export type { FileCardListProps as RemoteFileCardListElementProps } from "@mittwald/flow-react-components/FileCardList";

export class RemoteFileCardListElement extends FlowRemoteElement<RemoteFileCardListElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {};
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
    "flr-file-card-list": InstanceType<typeof RemoteFileCardListElement>;
  }
}

customElements.define("flr-file-card-list", RemoteFileCardListElement);
