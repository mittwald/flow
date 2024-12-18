/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { MessageProps } from "@mittwald/flow-react-components/Message";
export type { MessageProps } from "@mittwald/flow-react-components/Message";

export const RemoteMessageElement = createRemoteElement<MessageProps>({
  properties: {
    type: {},
    orientation: {},
    children: {},
    className: {},
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-message": InstanceType<typeof RemoteMessageElement>;
  }
}

customElements.define("flr-message", RemoteMessageElement);
