/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ComponentPropsContextProviderProps as RemoteComponentPropsContextProviderElementProps } from "@mittwald/flow-react-components";
export type { ComponentPropsContextProviderProps as RemoteComponentPropsContextProviderElementProps } from "@mittwald/flow-react-components";

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
