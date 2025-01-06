/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { FieldErrorProps } from "@mittwald/flow-react-components/FieldError";
export type { FieldErrorProps } from "@mittwald/flow-react-components/FieldError";

export class RemoteFieldErrorElement extends FlowRemoteElement<FieldErrorProps> {
  static get remoteProperties() {
    return {
      id: {},
      style: {},
      className: {},
      children: {},
      wrapWith: {},
    };
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-field-error": InstanceType<typeof RemoteFieldErrorElement>;
  }
}

customElements.define("flr-field-error", RemoteFieldErrorElement);
