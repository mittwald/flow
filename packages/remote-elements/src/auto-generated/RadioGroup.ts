/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { RadioGroupProps } from "@mittwald/flow-react-components/RadioGroup";
export type { RadioGroupProps } from "@mittwald/flow-react-components/RadioGroup";

export class RemoteRadioGroupElement extends FlowRemoteElement<RadioGroupProps> {
  static get remoteProperties() {
    return {
      validationBehavior: {},
      isDisabled: {},
      isReadOnly: {},
      isRequired: {},
      isInvalid: {},
      validate: {},
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
      "aria-errormessage": {},
      orientation: {},
      children: {},
      wrapWith: {},
      s: {},
      m: {},
      l: {},
    };
  }

  static get remoteEvents() {
    return {
      focus: {},
      blur: {},
      focusChange: {},
      change: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-radio-group": InstanceType<typeof RemoteRadioGroupElement>;
  }
}

customElements.define("flr-radio-group", RemoteRadioGroupElement);
