/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CheckboxButtonProps } from "@mittwald/flow-react-components/CheckboxButton";
export type { CheckboxButtonProps } from "@mittwald/flow-react-components/CheckboxButton";

export class RemoteCheckboxButtonElement extends FlowRemoteElement<CheckboxButtonProps> {
  static get remoteProperties() {
    return {
      validationBehavior: {},
      isDisabled: {},
      isReadOnly: {},
      isRequired: {},
      isInvalid: {},
      validate: {},
      autoFocus: {},
      value: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      id: {},
      name: {},
      className: {},
      style: {},
      slot: {},
      "aria-controls": {},
      "aria-errormessage": {},
      excludeFromTabOrder: {},
      isIndeterminate: {},
      defaultSelected: {},
      isSelected: {},
      inputRef: {},
      children: {},
      wrapWith: {},
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
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-checkbox-button": InstanceType<typeof RemoteCheckboxButtonElement>;
  }
}

customElements.define("flr-checkbox-button", RemoteCheckboxButtonElement);
