/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContextualHelpProps } from "@mittwald/flow-react-components/ContextualHelp";
export type { ContextualHelpProps } from "@mittwald/flow-react-components/ContextualHelp";

export class RemoteContextualHelpElement extends FlowRemoteElement<ContextualHelpProps> {
  static get remoteProperties() {
    return {
      children: {},
      style: {},
      className: {},
      slot: {},
      width: {},
      isOpen: {},
      placement: {},
      containerPadding: {},
      offset: {},
      crossOffset: {},
      shouldFlip: {},
      triggerRef: {},
      boundaryElement: {},
      scrollRef: {},
      shouldUpdatePosition: {},
      maxHeight: {},
      arrowBoundaryOffset: {},
      isNonModal: {},
      isKeyboardDismissDisabled: {},
      shouldCloseOnInteractOutside: {},
      trigger: {},
      isEntering: {},
      isExiting: {},
      UNSTABLE_portalContainer: {},
      defaultOpen: {},
      isDialogContent: {},
      controller: {},
      padding: {},
    };
  }

  static get remoteEvents() {
    return {
      openChange: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-contextual-help": InstanceType<typeof RemoteContextualHelpElement>;
  }
}

customElements.define("flr-contextual-help", RemoteContextualHelpElement);
