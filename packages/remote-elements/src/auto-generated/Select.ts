/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SelectProps } from "@mittwald/flow-react-components/Select";
export type { SelectProps } from "@mittwald/flow-react-components/Select";

export class RemoteSelectElement extends FlowRemoteElement<SelectProps> {
  static get remoteProperties() {
    return {
      controller: {},
      validationBehavior: {},
      isDisabled: {},
      isRequired: {},
      isInvalid: {},
      validate: {},
      autoFocus: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      id: {},
      name: {},
      style: {},
      slot: {},
      isOpen: {},
      defaultOpen: {},
      excludeFromTabOrder: {},
      disabledKeys: {},
      autoComplete: {},
      placeholder: {},
      selectedKey: {},
      defaultSelectedKey: {},
      children: {},
      wrapWith: {},
      className: {},
    };
  }

  static get remoteEvents() {
    return {
      change: {},
      focus: {},
      blur: {},
      focusChange: {},
      keyDown: {},
      keyUp: {},
      openChange: {},
      selectionChange: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-select": InstanceType<typeof RemoteSelectElement>;
  }
}

customElements.define("flr-select", RemoteSelectElement);
