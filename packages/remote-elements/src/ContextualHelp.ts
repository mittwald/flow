/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { ContextualHelpProps } from "@mittwald/flow-react-components/ContextualHelp";
export type { ContextualHelpProps } from "@mittwald/flow-react-components/ContextualHelp";

export const RemoteContextualHelpElement =
  createRemoteElement<ContextualHelpProps>({
    properties: {
      children: {},
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
      width: {},
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
      padding: {},
      ref: {},
      key: {},
    },
    events: {
      openChange: {},
    },
  });

declare global {
  interface HTMLElementTagNameMap {
    "flr-contextual-help": InstanceType<typeof RemoteContextualHelpElement>;
  }
}

customElements.define("flr-contextual-help", RemoteContextualHelpElement);
