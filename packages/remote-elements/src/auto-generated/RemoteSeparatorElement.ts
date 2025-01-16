/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { SeparatorProps as RemoteSeparatorElementProps } from "@mittwald/flow-react-components/Separator";
export type { SeparatorProps as RemoteSeparatorElementProps } from "@mittwald/flow-react-components/Separator";

export class RemoteSeparatorElement extends FlowRemoteElement<RemoteSeparatorElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      className: {},
      elementType: {},
      id: {},
      slot: {},
    };
  }

  static override get remoteEvents() {
    return {};
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-separator": InstanceType<typeof RemoteSeparatorElement>;
  }
}

customElements.define("flr-separator", RemoteSeparatorElement);
