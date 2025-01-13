/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { NumberFieldProps as RemoteNumberFieldElementProps } from "@mittwald/flow-react-components/NumberField";
export type { NumberFieldProps as RemoteNumberFieldElementProps } from "@mittwald/flow-react-components/NumberField";

export class RemoteNumberFieldElement extends FlowRemoteElement<RemoteNumberFieldElementProps> {
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
      decrementAriaLabel: {},
      defaultValue: {},
      formatOptions: {},
      id: {},
      incrementAriaLabel: {},
      isDisabled: {},
      isInvalid: {},
      isReadOnly: {},
      isRequired: {},
      isWheelDisabled: {},
      maxValue: {},
      minValue: {},
      name: {},
      slot: {},
      step: {},
      validate: {},
      validationBehavior: {},
      value: {},
    };
  }

  static get remoteEvents() {
    return {
      beforeInput: {},
      blur: {},
      change: {},
      compositionEnd: {},
      compositionStart: {},
      compositionUpdate: {},
      copy: {},
      cut: {},
      focus: {},
      focusChange: {},
      input: {},
      keyDown: {},
      keyUp: {},
      paste: {},
      select: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-number-field": InstanceType<typeof RemoteNumberFieldElement>;
  }
}

customElements.define("flr-number-field", RemoteNumberFieldElement);
