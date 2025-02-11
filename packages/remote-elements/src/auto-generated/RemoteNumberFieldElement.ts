/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { NumberFieldProps as RemoteNumberFieldElementProps } from "@mittwald/flow-react-components";
export type { NumberFieldProps as RemoteNumberFieldElementProps } from "@mittwald/flow-react-components";

export class RemoteNumberFieldElement extends FlowRemoteElement<RemoteNumberFieldElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoFocus: {},
      className: {},
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

  static override get remoteEvents() {
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

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-number-field": InstanceType<typeof RemoteNumberFieldElement>;
  }
}

customElements.define("flr-number-field", RemoteNumberFieldElement);
