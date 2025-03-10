/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SearchFieldProps as RemoteSearchFieldElementProps } from "@mittwald/flow-react-components";
export type { SearchFieldProps as RemoteSearchFieldElementProps } from "@mittwald/flow-react-components";

export class RemoteSearchFieldElement extends FlowRemoteElement<RemoteSearchFieldElementProps> {
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
      clear: {},
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
      submit: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-search-field": InstanceType<typeof RemoteSearchFieldElement>;
  }
}

customElements.define("flr-search-field", RemoteSearchFieldElement);
