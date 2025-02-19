/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContextualHelpTriggerProps as RemoteContextualHelpTriggerElementProps } from "@mittwald/flow-react-components";
export type { ContextualHelpTriggerProps as RemoteContextualHelpTriggerElementProps } from "@mittwald/flow-react-components";

export class RemoteContextualHelpTriggerElement extends FlowRemoteElement<RemoteContextualHelpTriggerElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      isDefaultOpen: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-contextual-help-trigger": InstanceType<
      typeof RemoteContextualHelpTriggerElement
    >;
  }
}

customElements.define(
  "flr-contextual-help-trigger",
  RemoteContextualHelpTriggerElement,
);
