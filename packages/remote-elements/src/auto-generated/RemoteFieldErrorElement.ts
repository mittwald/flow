/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { FieldErrorProps as RemoteFieldErrorElementProps } from "@mittwald/flow-react-components/FieldError";
export type { FieldErrorProps as RemoteFieldErrorElementProps } from "@mittwald/flow-react-components/FieldError";

export class RemoteFieldErrorElement extends FlowRemoteElement<RemoteFieldErrorElementProps> {
  static override get remoteAttributes() {
    return ["style"];
  }

  static override get remoteProperties() {
    return {
      className: {},
      id: {},
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
    "flr-field-error": InstanceType<typeof RemoteFieldErrorElement>;
  }
}

customElements.define("flr-field-error", RemoteFieldErrorElement);
