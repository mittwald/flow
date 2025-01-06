/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ButtonProps } from "@mittwald/flow-react-components/Button";
export type { ButtonProps } from "@mittwald/flow-react-components/Button";

export class RemoteButtonElement extends FlowRemoteElement<ButtonProps> {
  static get remoteProperties() {
    return {
      slot: {},
      color: {},
      variant: {},
      size: {},
      "aria-disabled": {},
      isPending: {},
      isSucceeded: {},
      isFailed: {},
      unstyled: {},
      ariaSlot: {},
      form: {},
      formAction: {},
      formEncType: {},
      formMethod: {},
      formNoValidate: {},
      formTarget: {},
      name: {},
      value: {},
      "aria-haspopup": {},
      isDisabled: {},
      autoFocus: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      excludeFromTabOrder: {},
      id: {},
      type: {},
      "aria-controls": {},
      "aria-expanded": {},
      "aria-pressed": {},
      preventFocusOnPress: {},
      children: {},
      className: {},
      style: {},
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
      press: {},
      pressStart: {},
      pressEnd: {},
      pressChange: {},
      pressUp: {},
      hoverStart: {},
      hoverEnd: {},
      hoverChange: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-button": InstanceType<typeof RemoteButtonElement>;
  }
}

customElements.define("flr-button", RemoteButtonElement);
