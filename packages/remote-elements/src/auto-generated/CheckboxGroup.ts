/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CheckboxGroupProps } from "@mittwald/flow-react-components/CheckboxGroup";
export type { CheckboxGroupProps } from "@mittwald/flow-react-components/CheckboxGroup";

export class RemoteCheckboxGroupElement extends FlowRemoteElement<CheckboxGroupProps> {
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
      "aria-errormessage": {},
      style: {},
      className: {},
      slot: {},
      children: {},
      s: {},
      m: {},
      l: {},
      wrapWith: {},
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
    "flr-checkbox-group": InstanceType<typeof RemoteCheckboxGroupElement>;
  }
}

customElements.define("flr-checkbox-group", RemoteCheckboxGroupElement);
