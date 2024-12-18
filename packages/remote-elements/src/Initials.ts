/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { InitialsProps } from "@mittwald/flow-react-components/Initials";
export type { InitialsProps } from "@mittwald/flow-react-components/Initials";

export const RemoteInitialsElement = createRemoteElement<InitialsProps>({
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
    "flr-initials": InstanceType<typeof RemoteInitialsElement>;
  }
}

customElements.define("flr-initials", RemoteInitialsElement);
