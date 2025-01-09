/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { NumberFieldProps as RemoteNumberFieldElementProps } from "@mittwald/flow-react-components/NumberField";
export type { NumberFieldProps as RemoteNumberFieldElementProps } from "@mittwald/flow-react-components/NumberField";

export class RemoteNumberFieldElement extends FlowRemoteElement<RemoteNumberFieldElementProps> {
  static get remoteProperties() {
    return {
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      className: {},
      style: {},
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
      id: {},
      name: {},
      slot: {},
      step: {},
      decrementAriaLabel: {},
      incrementAriaLabel: {},
      isWheelDisabled: {},
      formatOptions: {},
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
