/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CartesianGridProps as RemoteCartesianGridElementProps } from "@mittwald/flow-react-components";
export type { CartesianGridProps as RemoteCartesianGridElementProps } from "@mittwald/flow-react-components";

export class RemoteCartesianGridElement extends FlowRemoteElement<RemoteCartesianGridElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      horizontal: {},
      strokeDasharray: {},
      vertical: {},
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
    "flr-cartesian-grid": InstanceType<typeof RemoteCartesianGridElement>;
  }
}

customElements.define("flr-cartesian-grid", RemoteCartesianGridElement);
