/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { TextAreaProps } from "@mittwald/flow-react-components/TextArea";
export type { TextAreaProps } from "@mittwald/flow-react-components/TextArea";

export class RemoteTextAreaElement extends FlowRemoteElement<TextAreaProps> {
  static get remoteProperties() {
    return {
      autoResizeMaxRows: {},
      children: {},
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
      showCharacterCount: {},
      placeholder: {},
      rows: {},
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
      select: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-text-area": InstanceType<typeof RemoteTextAreaElement>;
  }
}

customElements.define("flr-text-area", RemoteTextAreaElement);
