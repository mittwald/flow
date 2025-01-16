/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { ActionGroupProps as RemoteActionGroupElementProps } from "@mittwald/flow-react-components/ActionGroup";
export type { ActionGroupProps as RemoteActionGroupElementProps } from "@mittwald/flow-react-components/ActionGroup";

export class RemoteActionGroupElement extends FlowRemoteElement<RemoteActionGroupElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      className: {},
      ignoreBreakpoint: {},
      spacing: {},
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
    "flr-action-group": InstanceType<typeof RemoteActionGroupElement>;
  }
}

customElements.define("flr-action-group", RemoteActionGroupElement);
