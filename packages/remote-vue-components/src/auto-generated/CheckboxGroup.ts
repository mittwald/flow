/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteCheckboxGroupElement } from "@mittwald/flow-remote-elements";
import type { RemoteCheckboxGroupElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteCheckboxGroupElementProps as CheckboxGroupProps } from "@mittwald/flow-remote-elements";

export const CheckboxGroup: FlowRemoteVueComponent<RemoteCheckboxGroupElementProps> =
  createFlowRemoteComponent(
    "flr-checkbox-group",
    "CheckboxGroup",
    RemoteCheckboxGroupElement,
    {
      booleans: [
        "hidden",
        "inert",
        "isDisabled",
        "isInvalid",
        "isReadOnly",
        "isRequired",
      ],
    },
  );
