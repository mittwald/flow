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
      style: {},
      className: {},
      slot: {},
      step: {},
      minValue: {},
      maxValue: {},
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
      compositionStart: {},
      compositionEnd: {},
      compositionUpdate: {},
      select: {},
      beforeInput: {},
      input: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-number-field": InstanceType<typeof RemoteNumberFieldElement>;
  }
}

customElements.define("flr-number-field", RemoteNumberFieldElement);
