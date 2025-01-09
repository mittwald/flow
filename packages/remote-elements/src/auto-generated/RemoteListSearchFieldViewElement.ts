/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SearchFieldProps as RemoteListSearchFieldViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { SearchFieldProps as RemoteListSearchFieldViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListSearchFieldViewElement extends FlowRemoteElement<RemoteListSearchFieldViewElementProps> {
  static get remoteProperties() {
    return {
      value: {},
      autoSubmit: {},
      autoFocus: {},
    };
  }

  static get remoteEvents() {
    return {
      change: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-search-field-view": InstanceType<
      typeof RemoteListSearchFieldViewElement
    >;
  }
}

customElements.define(
  "flr-list-search-field-view",
  RemoteListSearchFieldViewElement,
);
