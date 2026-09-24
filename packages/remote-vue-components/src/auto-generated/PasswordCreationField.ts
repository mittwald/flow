/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemotePasswordCreationFieldElement } from "@mittwald/flow-remote-elements";
import type { RemotePasswordCreationFieldElementProps } from "@mittwald/flow-remote-elements";
export { type RemotePasswordCreationFieldElementProps as PasswordCreationFieldProps } from "@mittwald/flow-remote-elements";

export const PasswordCreationField: FlowRemoteVueComponent<RemotePasswordCreationFieldElementProps> =
  createFlowRemoteComponent(
    "flr-password-creation-field",
    "PasswordCreationField",
    RemotePasswordCreationFieldElement,
    {
      booleans: [
        "autoFocus",
        "excludeFromTabOrder",
        "hidden",
        "inert",
        "isDisabled",
        "isInvalid",
        "isReadOnly",
        "isRequired",
      ],
    },
  );
