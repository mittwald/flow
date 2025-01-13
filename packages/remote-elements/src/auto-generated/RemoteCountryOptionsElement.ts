/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CountryOptionsProps as RemoteCountryOptionsElementProps } from "@mittwald/flow-react-components/Select";
export type { CountryOptionsProps as RemoteCountryOptionsElementProps } from "@mittwald/flow-react-components/Select";

export class RemoteCountryOptionsElement extends FlowRemoteElement<RemoteCountryOptionsElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      defaultSelectedKeys: {},
      dependencies: {},
      disabledKeys: {},
      disallowEmptySelection: {},
      dragAndDropHooks: {},
      filterBy: {},
      id: {},
      items: {},
      layout: {},
      orientation: {},
      renderEmptyState: {},
      selectedKeys: {},
      selectionBehavior: {},
      selectionMode: {},
      shouldFocusWrap: {},
      slot: {},
      sortBy: {},
    };
  }

  static get remoteEvents() {
    return {
      action: {},
      blur: {},
      focus: {},
      focusChange: {},
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
