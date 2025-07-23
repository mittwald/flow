/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { PasswordCreationFieldProps as RemotePasswordCreationFieldElementProps } from "@mittwald/flow-react-components";
export type { PasswordCreationFieldProps as RemotePasswordCreationFieldElementProps } from "@mittwald/flow-react-components";

export class RemotePasswordCreationFieldElement extends FlowRemoteElement<RemotePasswordCreationFieldElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-activedescendant": {},
      "aria-autocomplete": {},
      "aria-controls": {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-errormessage": {},
      "aria-haspopup": {},
      "aria-label": {},
      "aria-labelledby": {},
      autoComplete: {},
      autoCorrect: {},
      autoFocus: {},
      className: {},
      defaultValue: {},
      enterKeyHint: {},
      excludeFromTabOrder: {},
      id: {},
      inputMode: {},
      isDisabled: {},
      isInvalid: {},
      isReadOnly: {},
      isRequired: {},
      maxLength: {},
      minLength: {},
      name: {},
      pattern: {},
      placeholder: {},
      slot: {},
      spellCheck: {},
      type: {},
      validate: {},
      validationBehavior: {},
      validationErrors: {},
      validationPolicy: {},
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
      validationResult: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-password-creation-field": InstanceType<
      typeof RemotePasswordCreationFieldElement
    >;
  }
}

customElements.define(
  "flr-password-creation-field",
  RemotePasswordCreationFieldElement,
);
