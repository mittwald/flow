/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { FlexProps as RemoteFlexElementProps } from "@mittwald/flow-react-components";
export type { FlexProps as RemoteFlexElementProps } from "@mittwald/flow-react-components";

export class RemoteFlexElement extends FlowRemoteElement<RemoteFlexElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      align: {},
      className: {},
      columnGap: {},
      direction: {},
      gap: {},
      grow: {},
      justify: {},
      rowGap: {},
      wrap: {},
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
    "flr-flex": InstanceType<typeof RemoteFlexElement>;
  }
}

customElements.define("flr-flex", RemoteFlexElement);
