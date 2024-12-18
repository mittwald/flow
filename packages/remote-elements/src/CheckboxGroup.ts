/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { CheckboxGroupProps } from "@mittwald/flow-react-components/CheckboxGroup";
export type { CheckboxGroupProps } from "@mittwald/flow-react-components/CheckboxGroup";

export const RemoteCheckboxGroupElement =
  createRemoteElement<CheckboxGroupProps>({
    properties: {
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      className: {},
      style: {},
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
      "aria-errormessage": {},
      slot: {},
      children: {},
      s: {},
      m: {},
      l: {},
      wrapWith: {},
      ref: {},
      key: {},
    },
    events: {
      focus: {},
      blur: {},
      focusChange: {},
      change: {},
    },
  });

declare global {
  interface HTMLElementTagNameMap {
    "flr-checkbox-group": InstanceType<typeof RemoteCheckboxGroupElement>;
  }
}

customElements.define("flr-checkbox-group", RemoteCheckboxGroupElement);
