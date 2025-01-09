/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { FieldErrorProps as RemoteFieldErrorElementProps } from "@mittwald/flow-react-components/FieldError";
export type { FieldErrorProps as RemoteFieldErrorElementProps } from "@mittwald/flow-react-components/FieldError";

export class RemoteFieldErrorElement extends FlowRemoteElement<RemoteFieldErrorElementProps> {
  static get remoteProperties() {
    return {
      className: {},
      style: {},
      id: {},
      wrapWith: {},
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
    "flr-field-error": InstanceType<typeof RemoteFieldErrorElement>;
  }
}

customElements.define("flr-field-error", RemoteFieldErrorElement);
