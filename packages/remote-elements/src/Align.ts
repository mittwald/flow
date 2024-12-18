/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { AlignProps } from "@mittwald/flow-react-components/Align";
export type { AlignProps } from "@mittwald/flow-react-components/Align";

export const RemoteAlignElement = createRemoteElement<AlignProps>({
  properties: {
    children: {},
    className: {},
    wrapWith: {},
    ref: {},
    key: {},
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-align": InstanceType<typeof RemoteAlignElement>;
  }
}

customElements.define("flr-align", RemoteAlignElement);
