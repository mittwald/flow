/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ButtonProps as RemoteButtonElementProps } from "@mittwald/flow-react-components/Button";
export type { ButtonProps as RemoteButtonElementProps } from "@mittwald/flow-react-components/Button";

export class RemoteButtonElement extends FlowRemoteElement<RemoteButtonElementProps> {
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
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      isDisabled: {},
      autoFocus: {},
      id: {},
      "aria-controls": {},
      "aria-expanded": {},
      "aria-haspopup": {},
      "aria-pressed": {},
      type: {},
      preventFocusOnPress: {},
      excludeFromTabOrder: {},
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

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-button": InstanceType<typeof RemoteButtonElement>;
  }
}

customElements.define("flr-button", RemoteButtonElement);
