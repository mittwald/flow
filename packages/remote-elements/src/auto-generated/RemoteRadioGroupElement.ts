/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { RadioGroupProps as RemoteRadioGroupElementProps } from "@mittwald/flow-react-components/RadioGroup";
export type { RadioGroupProps as RemoteRadioGroupElementProps } from "@mittwald/flow-react-components/RadioGroup";

export class RemoteRadioGroupElement extends FlowRemoteElement<RemoteRadioGroupElementProps> {
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
      value: {},
      defaultValue: {},
      id: {},
      name: {},
      slot: {},
      "aria-errormessage": {},
      orientation: {},
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

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-radio-group": InstanceType<typeof RemoteRadioGroupElement>;
  }
}

customElements.define("flr-radio-group", RemoteRadioGroupElement);
