/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { ActionStateContextProps } from "@mittwald/flow-react-components/ActionStateContext";
export type { ActionStateContextProps } from "@mittwald/flow-react-components/ActionStateContext";

export const RemoteActionStateContextElement =
  createRemoteElement<ActionStateContextProps>({
    properties: {
      isStarted: {},
      hasSucceeded: {},
      hasFailedWithError: {},
      children: {},
    },
    events: {},
  });

declare global {
  interface HTMLElementTagNameMap {
    "flr-action-state-context": InstanceType<
      typeof RemoteActionStateContextElement
    >;
  }
}

customElements.define(
  "flr-action-state-context",
  RemoteActionStateContextElement,
);
