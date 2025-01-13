/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CheckboxProps as RemoteCheckboxElementProps } from "@mittwald/flow-react-components/Checkbox";
export type { CheckboxProps as RemoteCheckboxElementProps } from "@mittwald/flow-react-components/Checkbox";

export class RemoteCheckboxElement extends FlowRemoteElement<RemoteCheckboxElementProps> {
  static get remoteProperties() {
    return {
      "aria-controls": {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-errormessage": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      defaultSelected: {},
      excludeFromTabOrder: {},
      id: {},
      inputRef: {},
      isDisabled: {},
      isIndeterminate: {},
      isInvalid: {},
      isReadOnly: {},
      isRequired: {},
      isSelected: {},
      name: {},
      slot: {},
      validate: {},
      validationBehavior: {},
      value: {},
    };
  }

  static get remoteEvents() {
    return {
      blur: {},
      change: {},
      focus: {},
      focusChange: {},
      hoverChange: {},
      hoverEnd: {},
      hoverStart: {},
      keyDown: {},
      keyUp: {},
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
