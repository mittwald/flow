/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ClearPropsContextContentProps as RemoteClearPropsContextContentElementProps } from "@mittwald/flow-react-components";
export type { ClearPropsContextContentProps as RemoteClearPropsContextContentElementProps } from "@mittwald/flow-react-components";

export class RemoteClearPropsContextContentElement extends FlowRemoteElement<RemoteClearPropsContextContentElementProps> {
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
    "flr-clear-props-context-content": InstanceType<
      typeof RemoteClearPropsContextContentElement
    >;
  }
}

customElements.define(
  "flr-clear-props-context-content",
  RemoteClearPropsContextContentElement,
);
