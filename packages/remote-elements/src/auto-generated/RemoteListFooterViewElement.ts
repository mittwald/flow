/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { FooterProps as RemoteListFooterViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { FooterProps as RemoteListFooterViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListFooterViewElement extends FlowRemoteElement<RemoteListFooterViewElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {};
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
    "flr-list-footer-view": InstanceType<typeof RemoteListFooterViewElement>;
  }
}

customElements.define("flr-list-footer-view", RemoteListFooterViewElement);
