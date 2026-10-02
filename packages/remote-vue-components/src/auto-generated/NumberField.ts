/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteNumberFieldElement } from "@mittwald/flow-remote-elements";
import type { RemoteNumberFieldElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteNumberFieldElementProps as NumberFieldProps } from "@mittwald/flow-remote-elements";

export const NumberField: FlowRemoteVueComponent<RemoteNumberFieldElementProps> =
  createFlowRemoteComponent(
    "flr-number-field",
    "NumberField",
    RemoteNumberFieldElement,
    {
      booleans: [
        "autoFocus",
        "hidden",
        "inert",
        "isDisabled",
        "isInvalid",
        "isReadOnly",
        "isRequired",
        "isWheelDisabled",
      ],
    },
  );
