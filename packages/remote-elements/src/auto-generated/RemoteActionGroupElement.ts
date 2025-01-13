/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { ActionGroupProps as RemoteActionGroupElementProps } from "@mittwald/flow-react-components/ActionGroup";
export type { ActionGroupProps as RemoteActionGroupElementProps } from "@mittwald/flow-react-components/ActionGroup";

export class RemoteActionGroupElement extends FlowRemoteElement<RemoteActionGroupElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      ignoreBreakpoint: {},
      spacing: {},
    };
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-action-group": InstanceType<typeof RemoteActionGroupElement>;
  }
}

customElements.define("flr-action-group", RemoteActionGroupElement);
