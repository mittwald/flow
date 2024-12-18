/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { WrapProps } from "@mittwald/flow-react-components/Wrap";
export type { WrapProps } from "@mittwald/flow-react-components/Wrap";

export const RemoteWrapElement = createRemoteElement<WrapProps>({
  properties: {
    if: {},
    children: {},
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-wrap": InstanceType<typeof RemoteWrapElement>;
  }
}

customElements.define("flr-wrap", RemoteWrapElement);
