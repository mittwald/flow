/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SearchFieldProps } from "@mittwald/flow-react-components/SearchField";
export type { SearchFieldProps } from "@mittwald/flow-react-components/SearchField";

export class RemoteSearchFieldElement extends FlowRemoteElement<SearchFieldProps> {
  static get remoteProperties() {
    return {
      validationBehavior: {},
      "aria-activedescendant": {},
      "aria-autocomplete": {},
      "aria-haspopup": {},
      isDisabled: {},
      isReadOnly: {},
      isRequired: {},
      isInvalid: {},
      validate: {},
      autoFocus: {},
      value: {},
      defaultValue: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      excludeFromTabOrder: {},
      id: {},
      autoComplete: {},
      maxLength: {},
      minLength: {},
      pattern: {},
      type: {},
      inputMode: {},
      name: {},
      "aria-errormessage": {},
      style: {},
      className: {},
      slot: {},
      children: {},
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
      compositionStart: {},
      compositionEnd: {},
      compositionUpdate: {},
      select: {},
      beforeInput: {},
      input: {},
      submit: {},
      clear: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-search-field": InstanceType<typeof RemoteSearchFieldElement>;
  }
}

customElements.define("flr-search-field", RemoteSearchFieldElement);
