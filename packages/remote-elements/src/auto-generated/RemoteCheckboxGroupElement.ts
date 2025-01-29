/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CheckboxGroupProps as RemoteCheckboxGroupElementProps } from "@mittwald/flow-react-components/CheckboxGroup";
export type { CheckboxGroupProps as RemoteCheckboxGroupElementProps } from "@mittwald/flow-react-components/CheckboxGroup";

export class RemoteCheckboxGroupElement extends FlowRemoteElement<RemoteCheckboxGroupElementProps> {
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
    "flr-checkbox-group": InstanceType<typeof RemoteCheckboxGroupElement>;
  }
}

customElements.define("flr-checkbox-group", RemoteCheckboxGroupElement);
