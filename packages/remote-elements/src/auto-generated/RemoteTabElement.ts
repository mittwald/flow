/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { TabProps as RemoteTabElementProps } from "@mittwald/flow-react-components/Tabs";
export type { TabProps as RemoteTabElementProps } from "@mittwald/flow-react-components/Tabs";

export class RemoteTabElement extends FlowRemoteElement<RemoteTabElementProps> {
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
      id: {},
      shouldForceMount: {},
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
    "flr-tab": InstanceType<typeof RemoteTabElement>;
  }
}

customElements.define("flr-tab", RemoteTabElement);
