/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { SeparatorProps } from "@mittwald/flow-react-components/Separator";
export type { SeparatorProps } from "@mittwald/flow-react-components/Separator";

export const RemoteSeparatorElement = createRemoteElement<SeparatorProps>({
  properties: {
    "aria-label": {},
    "aria-labelledby": {},
    "aria-describedby": {},
    "aria-details": {},
    className: {},
    style: {},
    id: {},
    slot: {},
    elementType: {},
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-separator": InstanceType<typeof RemoteSeparatorElement>;
  }
}

customElements.define("flr-separator", RemoteSeparatorElement);
