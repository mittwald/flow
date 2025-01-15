/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { SelectProps as RemoteSelectElementProps } from "@mittwald/flow-react-components/Select";
export type { SelectProps as RemoteSelectElementProps } from "@mittwald/flow-react-components/Select";

export class RemoteSelectElement extends FlowRemoteElement<RemoteSelectElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoComplete: {},
      autoFocus: {},
      controller: {},
      defaultOpen: {},
      defaultSelectedKey: {},
      disabledKeys: {},
      excludeFromTabOrder: {},
      id: {},
      isDisabled: {},
      isInvalid: {},
      isOpen: {},
      isRequired: {},
      name: {},
      placeholder: {},
      selectedKey: {},
      slot: {},
      validate: {},
      validationBehavior: {},
    };
  }

  static override get remoteEvents() {
    return {
      blur: {},
      change: {},
      focus: {},
      focusChange: {},
      keyDown: {},
      keyUp: {},
      openChange: {},
      selectionChange: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-select": InstanceType<typeof RemoteSelectElement>;
  }
}

customElements.define("flr-select", RemoteSelectElement);
