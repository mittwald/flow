/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CheckboxGroupProps as RemoteCheckboxGroupElementProps } from "@mittwald/flow-react-components/CheckboxGroup";
export type { CheckboxGroupProps as RemoteCheckboxGroupElementProps } from "@mittwald/flow-react-components/CheckboxGroup";

export class RemoteCheckboxGroupElement extends FlowRemoteElement<RemoteCheckboxGroupElementProps> {
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
    "flr-checkbox-group": InstanceType<typeof RemoteCheckboxGroupElement>;
  }
}

customElements.define("flr-checkbox-group", RemoteCheckboxGroupElement);
