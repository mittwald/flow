/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { LineProps as RemoteLineElementProps } from "@mittwald/flow-react-components";
export type { LineProps as RemoteLineElementProps } from "@mittwald/flow-react-components";

export class RemoteLineElement extends FlowRemoteElement<RemoteLineElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      color: {},
      dataKey: {},
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
    "flr-line": InstanceType<typeof RemoteLineElement>;
  }
}

customElements.define("flr-line", RemoteLineElement);
