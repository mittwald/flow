/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CountryOptionsProps as RemoteCountryOptionsElementProps } from "@mittwald/flow-react-components";
export type { CountryOptionsProps as RemoteCountryOptionsElementProps } from "@mittwald/flow-react-components";

export class RemoteCountryOptionsElement extends FlowRemoteElement<RemoteCountryOptionsElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      className: {},
      defaultSelectedKeys: {},
      dependencies: {},
      disabledKeys: {},
      disallowEmptySelection: {},
      dragAndDropHooks: {},
      escapeKeyBehavior: {},
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
      shouldSelectOnPressUp: {},
      slot: {},
      sortBy: {},
    };
  }

  static override get remoteEvents() {
    return {
      action: {},
      blur: {},
      focus: {},
      focusChange: {},
      scroll: {},
      selectionChange: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-country-options": InstanceType<typeof RemoteCountryOptionsElement>;
  }
}

customElements.define("flr-country-options", RemoteCountryOptionsElement);
