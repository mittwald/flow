/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { ModalProps } from "@mittwald/flow-react-components/Modal";
export type { ModalProps } from "@mittwald/flow-react-components/Modal";

export const RemoteModalElement = createRemoteElement<ModalProps>({
  properties: {
    size: {},
    offCanvas: {},
    offCanvasOrientation: {},
    controller: {},
    slot: {},
    isDismissable: {},
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
    "flr-modal": InstanceType<typeof RemoteModalElement>;
  }
}

customElements.define("flr-modal", RemoteModalElement);
