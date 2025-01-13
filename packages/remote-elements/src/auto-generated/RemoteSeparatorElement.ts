/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { SeparatorProps as RemoteSeparatorElementProps } from "@mittwald/flow-react-components/Separator";
export type { SeparatorProps as RemoteSeparatorElementProps } from "@mittwald/flow-react-components/Separator";

export class RemoteSeparatorElement extends FlowRemoteElement<RemoteSeparatorElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      elementType: {},
      id: {},
      slot: {},
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
