/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SeparatorProps as RemoteSeparatorElementProps } from "@mittwald/flow-react-components/Separator";
export type { SeparatorProps as RemoteSeparatorElementProps } from "@mittwald/flow-react-components/Separator";

export class RemoteSeparatorElement extends FlowRemoteElement<RemoteSeparatorElementProps> {
  static get remoteProperties() {
    return {
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      className: {},
      style: {},
      id: {},
      slot: {},
      elementType: {},
    };
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-separator": InstanceType<typeof RemoteSeparatorElement>;
  }
}

customElements.define("flr-separator", RemoteSeparatorElement);
