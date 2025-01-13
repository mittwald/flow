/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { RadioGroupProps as RemoteRadioGroupElementProps } from "@mittwald/flow-react-components/RadioGroup";
export type { RadioGroupProps as RemoteRadioGroupElementProps } from "@mittwald/flow-react-components/RadioGroup";

export class RemoteRadioGroupElement extends FlowRemoteElement<RemoteRadioGroupElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-errormessage": {},
      "aria-label": {},
      "aria-labelledby": {},
      defaultValue: {},
      id: {},
      isDisabled: {},
      isInvalid: {},
      isReadOnly: {},
      isRequired: {},
      l: {},
      m: {},
      name: {},
      orientation: {},
      s: {},
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
