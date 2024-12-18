/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { ActionProps } from "@mittwald/flow-react-components/Action";
export type { ActionProps } from "@mittwald/flow-react-components/Action";

export const RemoteActionElement = createRemoteElement<ActionProps>({
  properties: {
    action: {},
    actionModel: {},
    closeOverlay: {},
    openOverlay: {},
    toggleOverlay: {},
    break: {},
    skip: {},
    showFeedback: {},
    children: {},
    wrapWith: {},
    ref: {},
    key: {},
  },
  events: {
    action: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-action": InstanceType<typeof RemoteActionElement>;
  }
}

customElements.define("flr-action", RemoteActionElement);
