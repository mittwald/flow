/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ViewModeMenuProps as RemoteListViewModeMenuViewElementProps } from "@mittwald/flow-react-components/List/views";
export type { ViewModeMenuProps as RemoteListViewModeMenuViewElementProps } from "@mittwald/flow-react-components/List/views";

export class RemoteListViewModeMenuViewElement extends FlowRemoteElement<RemoteListViewModeMenuViewElementProps> {
  static get remoteProperties() {
    return {
      selectedViewMode: {},
      availableViewModes: {},
    };
  }

  static get remoteEvents() {
    return {
      viewModeSelected: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-list-view-mode-menu-view": InstanceType<
      typeof RemoteListViewModeMenuViewElement
    >;
  }
}

customElements.define(
  "flr-list-view-mode-menu-view",
  RemoteListViewModeMenuViewElement,
);
