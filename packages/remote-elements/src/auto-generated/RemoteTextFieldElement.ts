/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TextFieldProps as RemoteTextFieldElementProps } from "@mittwald/flow-react-components";
export type { TextFieldProps as RemoteTextFieldElementProps } from "@mittwald/flow-react-components";

export class RemoteTextFieldElement extends FlowRemoteElement<RemoteTextFieldElementProps> {
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
      form: {},
      id: {},
      inputMode: {},
      isDisabled: {},
      isInvalid: {},
      isPasswordRevealed: {},
      isReadOnly: {},
      isRequired: {},
      maxLength: {},
      minLength: {},
      name: {},
      pattern: {},
      placeholder: {},
      showCharacterCount: {},
      slot: {},
      spellCheck: {},
      type: {},
      validate: {},
      validationBehavior: {},
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
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-text-field": InstanceType<typeof RemoteTextFieldElement>;
  }
}

customElements.define("flr-text-field", RemoteTextFieldElement);
