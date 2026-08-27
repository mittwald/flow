/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { ContextualHelpTriggerProps } from "@mittwald/flow-react-components";
export type RemoteContextualHelpTriggerElementProps =
  WithSerializableClassName<ContextualHelpTriggerProps>;

export class RemoteContextualHelpTriggerElement extends FlowRemoteElement<RemoteContextualHelpTriggerElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      "aria-label": {},
      isDefaultOpen: {},
      subject: {},
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
