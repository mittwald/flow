/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { YAxisProps } from "@mittwald/flow-react-components";
export type RemoteYAxisElementProps = WithSerializableClassName<YAxisProps>;

export class RemoteYAxisElement extends FlowRemoteElement<RemoteYAxisElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
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
    "flr-y-axis": InstanceType<typeof RemoteYAxisElement>;
  }
}

customElements.define("flr-y-axis", RemoteYAxisElement);
