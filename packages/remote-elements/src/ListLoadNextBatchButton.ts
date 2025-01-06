import { FlowRemoteElement } from "@/lib/FlowRemoteElement";

export class RemoteListLoadNextBatchButtonElement extends FlowRemoteElement {
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
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-load-next-batch-button": InstanceType<
      typeof RemoteListLoadNextBatchButtonElement
    >;
  }
}

customElements.define(
  "flr-list-load-next-batch-button",
  RemoteListLoadNextBatchButtonElement,
);
