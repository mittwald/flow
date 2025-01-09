/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContextualHelpProps as RemoteContextualHelpElementProps } from "@mittwald/flow-react-components/ContextualHelp";
export type { ContextualHelpProps as RemoteContextualHelpElementProps } from "@mittwald/flow-react-components/ContextualHelp";

export class RemoteContextualHelpElement extends FlowRemoteElement<RemoteContextualHelpElementProps> {
  static get remoteProperties() {
    return {
      arrowBoundaryOffset: {},
      triggerRef: {},
      isEntering: {},
      isExiting: {},
      UNSTABLE_portalContainer: {},
      placement: {},
      containerPadding: {},
      offset: {},
      crossOffset: {},
      shouldFlip: {},
      isOpen: {},
      defaultOpen: {},
      className: {},
      style: {},
      slot: {},
      boundaryElement: {},
      scrollRef: {},
      shouldUpdatePosition: {},
      maxHeight: {},
      isNonModal: {},
      isKeyboardDismissDisabled: {},
      shouldCloseOnInteractOutside: {},
      trigger: {},
      isDialogContent: {},
      controller: {},
      width: {},
      padding: {},
    };
  }

  static get remoteEvents() {
    return {
      openChange: {},
    };
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-contextual-help": InstanceType<typeof RemoteContextualHelpElement>;
  }
}

customElements.define("flr-contextual-help", RemoteContextualHelpElement);
