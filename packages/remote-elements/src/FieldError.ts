/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { FieldErrorProps } from "@mittwald/flow-react-components/FieldError";
export type { FieldErrorProps } from "@mittwald/flow-react-components/FieldError";

export const RemoteFieldErrorElement = createRemoteElement<FieldErrorProps>({
  properties: {
    className: {},
    style: {},
    id: {},
    children: {},
    wrapWith: {},
    ref: {},
    key: {},
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-field-error": InstanceType<typeof RemoteFieldErrorElement>;
  }
}

customElements.define("flr-field-error", RemoteFieldErrorElement);
