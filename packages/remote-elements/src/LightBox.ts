/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { LightBoxProps } from "@mittwald/flow-react-components/LightBox";
export type { LightBoxProps } from "@mittwald/flow-react-components/LightBox";

export const RemoteLightBoxElement = createRemoteElement<LightBoxProps>({
  properties: {
    controller: {},
    fitScreen: {},
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
    "flr-light-box": InstanceType<typeof RemoteLightBoxElement>;
  }
}

customElements.define("flr-light-box", RemoteLightBoxElement);
