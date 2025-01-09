/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { HeaderProps as RemoteListHeaderViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { HeaderProps as RemoteListHeaderViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListHeaderViewElement extends FlowRemoteElement<RemoteListHeaderViewElementProps> {
  static get remoteProperties() {
    return {
      showSearch: {},
      autoSubmitSearch: {},
      searchValue: {},
    };
  }

  static get remoteEvents() {
    return {
      searchChanged: {},
    };
  }

  static get remoteSlots() {
    return ["filterPickerList", "activeFilterList"];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-header-view": InstanceType<typeof RemoteListHeaderViewElement>;
  }
}

customElements.define("flr-list-header-view", RemoteListHeaderViewElement);
