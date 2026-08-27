/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { WithSerializableClassName } from "@/lib/RemoteProps";
import type { ComponentPropsContextProviderProps } from "@mittwald/flow-react-components";
export type RemoteComponentPropsContextProviderElementProps =
  WithSerializableClassName<ComponentPropsContextProviderProps>;

export class RemoteComponentPropsContextProviderElement extends FlowRemoteElement<RemoteComponentPropsContextProviderElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {};
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
    "flr-component-props-context-provider": InstanceType<
      typeof RemoteComponentPropsContextProviderElement
    >;
  }
}

customElements.define(
  "flr-component-props-context-provider",
  RemoteComponentPropsContextProviderElement,
);
