/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { NumberFieldProps } from "@mittwald/flow-react-components/NumberField";
export type { NumberFieldProps } from "@mittwald/flow-react-components/NumberField";

export class RemoteNumberFieldElement extends FlowRemoteElement<NumberFieldProps> {
  static get remoteProperties() {
    return {
      validationBehavior: {},
      minValue: {},
      maxValue: {},
      isDisabled: {},
      isReadOnly: {},
      isRequired: {},
      isInvalid: {},
      validate: {},
      autoFocus: {},
      value: {},
      defaultValue: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      id: {},
      name: {},
      className: {},
      style: {},
      slot: {},
      step: {},
      decrementAriaLabel: {},
      incrementAriaLabel: {},
      isWheelDisabled: {},
      formatOptions: {},
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
      copy: {},
      cut: {},
      paste: {},
      compositionEnd: {},
      compositionStart: {},
      compositionUpdate: {},
      beforeInput: {},
      input: {},
      select: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-number-field": InstanceType<typeof RemoteNumberFieldElement>;
  }
}

customElements.define("flr-number-field", RemoteNumberFieldElement);
