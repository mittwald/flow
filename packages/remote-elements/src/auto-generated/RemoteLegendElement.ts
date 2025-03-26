/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LegendProps as RemoteLegendElementProps } from "@mittwald/flow-react-components";
export type { LegendProps as RemoteLegendElementProps } from "@mittwald/flow-react-components";

export class RemoteLegendElement extends FlowRemoteElement<RemoteLegendElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
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
    "flr-legend": InstanceType<typeof RemoteLegendElement>;
  }
}

customElements.define("flr-legend", RemoteLegendElement);
