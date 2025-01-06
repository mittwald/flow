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
      compositionStart: {},
      compositionEnd: {},
      compositionUpdate: {},
      select: {},
      beforeInput: {},
      input: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-text-area": InstanceType<typeof RemoteTextAreaElement>;
  }
}

customElements.define("flr-text-area", RemoteTextAreaElement);
