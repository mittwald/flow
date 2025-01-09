/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SearchFieldProps as RemoteSearchFieldElementProps } from "@mittwald/flow-react-components/SearchField";
export type { SearchFieldProps as RemoteSearchFieldElementProps } from "@mittwald/flow-react-components/SearchField";

export class RemoteSearchFieldElement extends FlowRemoteElement<RemoteSearchFieldElementProps> {
  static get remoteProperties() {
    return {
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
      autoFocus: {},
      value: {},
      defaultValue: {},
      id: {},
      name: {},
      slot: {},
      pattern: {},
      inputMode: {},
      "aria-activedescendant": {},
      "aria-autocomplete": {},
      "aria-errormessage": {},
      "aria-haspopup": {},
      type: {},
      excludeFromTabOrder: {},
      autoComplete: {},
      maxLength: {},
      minLength: {},
      wrapWith: {},
    };
  }

  static get remoteEvents() {
    return {
      focus: {},
      blur: {},
      focusChange: {},
      keyDown: {},
      keyUp: {},
      change: {},
      copy: {},
      cut: {},
      paste: {},
      compositionEnd: {},
      compositionStart: {},
      compositionUpdate: {},
      beforeInput: {},
      input: {},
      submit: {},
      select: {},
      clear: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-search-field": InstanceType<typeof RemoteSearchFieldElement>;
  }
}

customElements.define("flr-search-field", RemoteSearchFieldElement);
