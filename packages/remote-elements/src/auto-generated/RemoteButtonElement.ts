/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { ButtonProps as RemoteButtonElementProps } from "@mittwald/flow-react-components/Button";
export type { ButtonProps as RemoteButtonElementProps } from "@mittwald/flow-react-components/Button";

export class RemoteButtonElement extends FlowRemoteElement<RemoteButtonElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      "aria-controls": {},
      "aria-describedby": {},
      "aria-details": {},
      "aria-disabled": {},
      "aria-expanded": {},
      "aria-haspopup": {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-pressed": {},
      ariaSlot: {},
      autoFocus: {},
      color: {},
      excludeFromTabOrder: {},
      form: {},
      formAction: {},
      formEncType: {},
      formMethod: {},
      formNoValidate: {},
      formTarget: {},
      id: {},
      isDisabled: {},
      isFailed: {},
      isPending: {},
      isSucceeded: {},
      name: {},
      preventFocusOnPress: {},
      size: {},
      slot: {},
      type: {},
      unstyled: {},
      value: {},
      variant: {},
    };
  }

  static override get remoteEvents() {
    return {
      blur: {},
      focus: {},
      focusChange: {},
      hoverChange: {},
      hoverEnd: {},
      hoverStart: {},
      keyDown: {},
      keyUp: {},
      press: {},
      pressChange: {},
      pressEnd: {},
      pressStart: {},
      pressUp: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-button": InstanceType<typeof RemoteButtonElement>;
  }
}

customElements.define("flr-button", RemoteButtonElement);
