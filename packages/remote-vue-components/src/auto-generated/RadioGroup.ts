/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteRadioGroupElement } from "@mittwald/flow-remote-elements";
import type { RemoteRadioGroupElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteRadioGroupElementProps as RadioGroupProps } from "@mittwald/flow-remote-elements";

export const RadioGroup: FlowRemoteVueComponent<RemoteRadioGroupElementProps> =
  createFlowRemoteComponent(
    "flr-radio-group",
    "RadioGroup",
    RemoteRadioGroupElement,
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
