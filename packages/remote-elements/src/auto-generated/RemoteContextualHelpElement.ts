/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContextualHelpProps as RemoteContextualHelpElementProps } from "@mittwald/flow-react-components/ContextualHelp";
export type { ContextualHelpProps as RemoteContextualHelpElementProps } from "@mittwald/flow-react-components/ContextualHelp";

export class RemoteContextualHelpElement extends FlowRemoteElement<RemoteContextualHelpElementProps> {
  static get remoteProperties() {
    return {
      UNSTABLE_portalContainer: {},
      arrowBoundaryOffset: {},
      boundaryElement: {},
      containerPadding: {},
      controller: {},
      crossOffset: {},
      defaultOpen: {},
      isDialogContent: {},
      isEntering: {},
      isExiting: {},
      isKeyboardDismissDisabled: {},
      isNonModal: {},
      isOpen: {},
      maxHeight: {},
      offset: {},
      padding: {},
      placement: {},
      scrollRef: {},
      shouldCloseOnInteractOutside: {},
      shouldFlip: {},
      shouldUpdatePosition: {},
      slot: {},
      trigger: {},
      triggerRef: {},
      width: {},
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
