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
      id: {},
      name: {},
      className: {},
      style: {},
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
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-search-field": InstanceType<typeof RemoteSearchFieldElement>;
  }
}

customElements.define("flr-search-field", RemoteSearchFieldElement);
