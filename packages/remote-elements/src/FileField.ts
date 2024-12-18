/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { FileFieldProps } from "@mittwald/flow-react-components/FileField";
export type { FileFieldProps } from "@mittwald/flow-react-components/FileField";

export const RemoteFileFieldElement = createRemoteElement<FileFieldProps>({
  properties: {
    children: {},
    wrapWith: {},
    name: {},
    accept: {},
    multiple: {},
    validationBehavior: {},
    isDisabled: {},
    isRequired: {},
    isInvalid: {},
    ref: {},
    key: {},
  },
  events: {
    change: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-file-field": InstanceType<typeof RemoteFileFieldElement>;
  }
}

customElements.define("flr-file-field", RemoteFileFieldElement);
