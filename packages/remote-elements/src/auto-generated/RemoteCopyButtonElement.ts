/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CopyButtonProps as RemoteCopyButtonElementProps } from "@mittwald/flow-react-components/CopyButton";
export type { CopyButtonProps as RemoteCopyButtonElementProps } from "@mittwald/flow-react-components/CopyButton";

export class RemoteCopyButtonElement extends FlowRemoteElement<RemoteCopyButtonElementProps> {
  static get remoteProperties() {
    return {
      text: {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      className: {},
      style: {},
      wrapWith: {},
      isDisabled: {},
      autoFocus: {},
      value: {},
      id: {},
      name: {},
      slot: {},
      form: {},
      color: {},
      "aria-controls": {},
      "aria-disabled": {},
      "aria-expanded": {},
      "aria-haspopup": {},
      "aria-pressed": {},
      type: {},
      size: {},
      preventFocusOnPress: {},
      excludeFromTabOrder: {},
      variant: {},
      isPending: {},
      isSucceeded: {},
      isFailed: {},
      unstyled: {},
      ariaSlot: {},
      formAction: {},
      formEncType: {},
      formMethod: {},
      formNoValidate: {},
      formTarget: {},
    };
  }

  static get remoteEvents() {
    return {
      focus: {},
      blur: {},
      focusChange: {},
      keyDown: {},
      keyUp: {},
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
    "flr-copy-button": InstanceType<typeof RemoteCopyButtonElement>;
  }
}

customElements.define("flr-copy-button", RemoteCopyButtonElement);
