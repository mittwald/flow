/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { XAxisProps as RemoteXAxisElementProps } from "@mittwald/flow-react-components";
export type { XAxisProps as RemoteXAxisElementProps } from "@mittwald/flow-react-components";

export class RemoteXAxisElement extends FlowRemoteElement<RemoteXAxisElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      allowDataOverflow: {},
      allowDecimals: {},
      className: {},
      dataKey: {},
      domain: {},
      hide: {},
      interval: {},
      minTickGap: {},
      orientation: {},
      scale: {},
      tickFormatter: {},
      type: {},
      unit: {},
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
    "flr-x-axis": InstanceType<typeof RemoteXAxisElement>;
  }
}

customElements.define("flr-x-axis", RemoteXAxisElement);
