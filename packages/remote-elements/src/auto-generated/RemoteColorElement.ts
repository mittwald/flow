/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { ColorProps } from "@mittwald/flow-react-components";
export type RemoteColorElementProps = WithSerializableClassName<ColorProps>;

export class RemoteColorElement extends FlowRemoteElement<RemoteColorElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
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
    "flr-color": InstanceType<typeof RemoteColorElement>;
  }
}

customElements.define("flr-color", RemoteColorElement);
