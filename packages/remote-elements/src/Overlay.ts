/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { OverlayProps } from "@mittwald/flow-react-components/Overlay";
export type { OverlayProps } from "@mittwald/flow-react-components/Overlay";

export const RemoteOverlayElement = createRemoteElement<OverlayProps>({
  properties: {
    controller: {},
    isDismissable: {},
    className: {},
    overlayType: {},
    children: {},
    ref: {},
    key: {},
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-overlay": InstanceType<typeof RemoteOverlayElement>;
  }
}

customElements.define("flr-overlay", RemoteOverlayElement);
