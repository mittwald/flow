/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { ActionGroupProps } from "@mittwald/flow-react-components/ActionGroup";
export type { ActionGroupProps } from "@mittwald/flow-react-components/ActionGroup";

export const RemoteActionGroupElement = createRemoteElement<ActionGroupProps>({
  properties: {
    ignoreBreakpoint: {},
    spacing: {},
    children: {},
    wrapWith: {},
    className: {},
    ref: {},
    key: {},
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-action-group": InstanceType<typeof RemoteActionGroupElement>;
  }
}

customElements.define("flr-action-group", RemoteActionGroupElement);
