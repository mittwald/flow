/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CheckboxButtonProps as RemoteCheckboxButtonElementProps } from "@mittwald/flow-react-components/CheckboxButton";
export type { CheckboxButtonProps as RemoteCheckboxButtonElementProps } from "@mittwald/flow-react-components/CheckboxButton";

export class RemoteCheckboxButtonElement extends FlowRemoteElement<RemoteCheckboxButtonElementProps> {
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
    "flr-checkbox-button": InstanceType<typeof RemoteCheckboxButtonElement>;
  }
}

customElements.define("flr-checkbox-button", RemoteCheckboxButtonElement);
