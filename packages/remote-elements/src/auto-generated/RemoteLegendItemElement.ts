/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LegendItemProps as RemoteLegendItemElementProps } from "@mittwald/flow-react-components";
export type { LegendItemProps as RemoteLegendItemElementProps } from "@mittwald/flow-react-components";

export class RemoteLegendItemElement extends FlowRemoteElement<RemoteLegendItemElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      color: {},
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
    "flr-legend-item": InstanceType<typeof RemoteLegendItemElement>;
  }
}

customElements.define("flr-legend-item", RemoteLegendItemElement);
