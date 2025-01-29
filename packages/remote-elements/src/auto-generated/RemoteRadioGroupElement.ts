/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { RadioGroupProps as RemoteRadioGroupElementProps } from "@mittwald/flow-react-components/RadioGroup";
export type { RadioGroupProps as RemoteRadioGroupElementProps } from "@mittwald/flow-react-components/RadioGroup";

export class RemoteRadioGroupElement extends FlowRemoteElement<RemoteRadioGroupElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-errormessage": {},
      "aria-label": {},
      "aria-labelledby": {},
      className: {},
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

  static override get remoteEvents() {
    return {
      blur: {},
      change: {},
      focus: {},
      focusChange: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-radio-group": InstanceType<typeof RemoteRadioGroupElement>;
  }
}

customElements.define("flr-radio-group", RemoteRadioGroupElement);
