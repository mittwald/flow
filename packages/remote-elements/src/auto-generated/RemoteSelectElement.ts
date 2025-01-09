/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SelectProps as RemoteSelectElementProps } from "@mittwald/flow-react-components/Select";
export type { SelectProps as RemoteSelectElementProps } from "@mittwald/flow-react-components/Select";

export class RemoteSelectElement extends FlowRemoteElement<RemoteSelectElementProps> {
  static get remoteProperties() {
    return {
      controller: {},
      isOpen: {},
      defaultOpen: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      style: {},
      validationBehavior: {},
      isDisabled: {},
      isRequired: {},
      isInvalid: {},
      validate: {},
      autoFocus: {},
      id: {},
      name: {},
      slot: {},
      excludeFromTabOrder: {},
      disabledKeys: {},
      autoComplete: {},
      placeholder: {},
      selectedKey: {},
      defaultSelectedKey: {},
      wrapWith: {},
      className: {},
    };
  }

  static get remoteEvents() {
    return {
      change: {},
      openChange: {},
      focus: {},
      blur: {},
      focusChange: {},
      keyDown: {},
      keyUp: {},
      selectionChange: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-select": InstanceType<typeof RemoteSelectElement>;
  }
}

customElements.define("flr-select", RemoteSelectElement);
