/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { ContextualHelpProps as RemoteContextualHelpElementProps } from "@mittwald/flow-react-components/ContextualHelp";
export type { ContextualHelpProps as RemoteContextualHelpElementProps } from "@mittwald/flow-react-components/ContextualHelp";

export class RemoteContextualHelpElement extends FlowRemoteElement<RemoteContextualHelpElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      UNSTABLE_portalContainer: {},
      arrowBoundaryOffset: {},
      boundaryElement: {},
      className: {},
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

  static override get remoteEvents() {
    return {
      openChange: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-contextual-help": InstanceType<typeof RemoteContextualHelpElement>;
  }
}

customElements.define("flr-contextual-help", RemoteContextualHelpElement);
