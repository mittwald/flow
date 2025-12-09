/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ClearPropsContextProps as RemoteClearPropsContextElementProps } from "@mittwald/flow-react-components";
export type { ClearPropsContextProps as RemoteClearPropsContextElementProps } from "@mittwald/flow-react-components";

export class RemoteClearPropsContextElement extends FlowRemoteElement<RemoteClearPropsContextElementProps> {
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
    "flr-clear-props-context": InstanceType<
      typeof RemoteClearPropsContextElement
    >;
  }
}

customElements.define(
  "flr-clear-props-context",
  RemoteClearPropsContextElement,
);
