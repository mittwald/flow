/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LoadNextBatchButtonProps as RemoteListLoadNextBatchButtonViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { LoadNextBatchButtonProps as RemoteListLoadNextBatchButtonViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListLoadNextBatchButtonViewElement extends FlowRemoteElement<RemoteListLoadNextBatchButtonViewElementProps> {
  static get remoteProperties() {
    return {
      isDisabled: {},
      isPending: {},
    };
  }

  static get remoteEvents() {
    return {
      press: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-load-next-batch-button-view": InstanceType<
      typeof RemoteListLoadNextBatchButtonViewElement
    >;
  }
}

customElements.define(
  "flr-list-load-next-batch-button-view",
  RemoteListLoadNextBatchButtonViewElement,
);
