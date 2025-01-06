/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SeparatorProps } from "@mittwald/flow-react-components/Separator";
export type { SeparatorProps } from "@mittwald/flow-react-components/Separator";

export class RemoteSeparatorElement extends FlowRemoteElement<SeparatorProps> {
  static get remoteProperties() {
    return {
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      id: {},
      style: {},
      className: {},
      slot: {},
      elementType: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-separator": InstanceType<typeof RemoteSeparatorElement>;
  }
}

customElements.define("flr-separator", RemoteSeparatorElement);
