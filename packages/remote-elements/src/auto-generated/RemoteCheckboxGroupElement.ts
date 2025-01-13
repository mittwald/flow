/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CheckboxGroupProps as RemoteCheckboxGroupElementProps } from "@mittwald/flow-react-components/CheckboxGroup";
export type { CheckboxGroupProps as RemoteCheckboxGroupElementProps } from "@mittwald/flow-react-components/CheckboxGroup";

export class RemoteCheckboxGroupElement extends FlowRemoteElement<RemoteCheckboxGroupElementProps> {
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
    "flr-checkbox-group": InstanceType<typeof RemoteCheckboxGroupElement>;
  }
}

customElements.define("flr-checkbox-group", RemoteCheckboxGroupElement);
