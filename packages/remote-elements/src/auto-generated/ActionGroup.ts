/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ActionGroupProps } from "@mittwald/flow-react-components/ActionGroup";
export type { ActionGroupProps } from "@mittwald/flow-react-components/ActionGroup";

export class RemoteActionGroupElement extends FlowRemoteElement<ActionGroupProps> {
  static get remoteProperties() {
    return {
      ignoreBreakpoint: {},
      spacing: {},
      children: {},
      wrapWith: {},
      className: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-action-group": InstanceType<typeof RemoteActionGroupElement>;
  }
}

customElements.define("flr-action-group", RemoteActionGroupElement);
