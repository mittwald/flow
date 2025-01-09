/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CountryOptionsProps as RemoteCountryOptionsElementProps } from "@mittwald/flow-react-components/Select";
export type { CountryOptionsProps as RemoteCountryOptionsElementProps } from "@mittwald/flow-react-components/Select";

export class RemoteCountryOptionsElement extends FlowRemoteElement<RemoteCountryOptionsElementProps> {
  static get remoteProperties() {
    return {
      filterBy: {},
      sortBy: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      autoFocus: {},
      id: {},
      slot: {},
      orientation: {},
      selectedKeys: {},
      defaultSelectedKeys: {},
      disabledKeys: {},
      shouldFocusWrap: {},
      items: {},
      selectionMode: {},
      disallowEmptySelection: {},
      selectionBehavior: {},
      dragAndDropHooks: {},
      renderEmptyState: {},
      layout: {},
      dependencies: {},
    };
  }

  static get remoteEvents() {
    return {
      focus: {},
      blur: {},
      focusChange: {},
      action: {},
      scroll: {},
      selectionChange: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-country-options": InstanceType<typeof RemoteCountryOptionsElement>;
  }
}

customElements.define("flr-country-options", RemoteCountryOptionsElement);
