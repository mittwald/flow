/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { AreaProps as RemoteAreaElementProps } from "@mittwald/flow-react-components";
export type { AreaProps as RemoteAreaElementProps } from "@mittwald/flow-react-components";

export class RemoteAreaElement extends FlowRemoteElement<RemoteAreaElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      color: {},
      dataKey: {},
      fillOpacity: {},
      stackId: {},
      type: {},
      unit: {},
      xAxisId: {},
      yAxisId: {},
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
    "flr-area": InstanceType<typeof RemoteAreaElement>;
  }
}

customElements.define("flr-area", RemoteAreaElement);
