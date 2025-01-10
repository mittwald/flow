/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { ContentProps as RemoteReactHookFormFieldContentViewElementProps } from "@mittwald/flow-react-components/react-hook-form/Field/views";
export type { ContentProps as RemoteReactHookFormFieldContentViewElementProps } from "@mittwald/flow-react-components/react-hook-form/Field/views";

export class RemoteReactHookFormFieldContentViewElement extends FlowRemoteElement<RemoteReactHookFormFieldContentViewElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      errorMessage: {},
    };
  }

  static get remoteEvents() {
    return {};
  }

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-react-hook-form-field-content-view": InstanceType<
      typeof RemoteReactHookFormFieldContentViewElement
    >;
  }
}

customElements.define(
  "flr-react-hook-form-field-content-view",
  RemoteReactHookFormFieldContentViewElement,
);
