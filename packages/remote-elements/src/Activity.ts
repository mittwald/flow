/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { ActivityProps } from "@mittwald/flow-react-components/Activity";
export type { ActivityProps } from "@mittwald/flow-react-components/Activity";

export const RemoteActivityElement = createRemoteElement<ActivityProps>({
  properties: {
    isActive: {},
    inactiveDelay: {},
    children: {},
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-activity": InstanceType<typeof RemoteActivityElement>;
  }
}

customElements.define("flr-activity", RemoteActivityElement);
