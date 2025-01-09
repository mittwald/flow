/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CheckboxProps as RemoteCheckboxElementProps } from "@mittwald/flow-react-components/Checkbox";
export type { CheckboxProps as RemoteCheckboxElementProps } from "@mittwald/flow-react-components/Checkbox";

export class RemoteCheckboxElement extends FlowRemoteElement<RemoteCheckboxElementProps> {
  static get remoteProperties() {
    return {
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      validationBehavior: {},
      isDisabled: {},
      isReadOnly: {},
      isRequired: {},
      isInvalid: {},
      validate: {},
      autoFocus: {},
      value: {},
      id: {},
      name: {},
      slot: {},
      "aria-controls": {},
      "aria-errormessage": {},
      excludeFromTabOrder: {},
      isIndeterminate: {},
      defaultSelected: {},
      isSelected: {},
      inputRef: {},
    };
  }

  static get remoteEvents() {
    return {
      focus: {},
      blur: {},
      focusChange: {},
      keyDown: {},
      keyUp: {},
      change: {},
      hoverStart: {},
      hoverEnd: {},
      hoverChange: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-checkbox": InstanceType<typeof RemoteCheckboxElement>;
  }
}

customElements.define("flr-checkbox", RemoteCheckboxElement);
