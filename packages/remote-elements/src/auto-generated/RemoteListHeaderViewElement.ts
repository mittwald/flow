/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { HeaderProps as RemoteListHeaderViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { HeaderProps as RemoteListHeaderViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListHeaderViewElement extends FlowRemoteElement<RemoteListHeaderViewElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      autoSubmitSearch: {},
      searchValue: {},
      showSearch: {},
    };
  }

  static override get remoteEvents() {
    return {
      searchChanged: {},
    };
  }

  static override get remoteSlots() {
    return ["activeFilterList", "filterPickerList", "viewModeMenu"];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-header-view": InstanceType<typeof RemoteListHeaderViewElement>;
  }
}

customElements.define("flr-list-header-view", RemoteListHeaderViewElement);
