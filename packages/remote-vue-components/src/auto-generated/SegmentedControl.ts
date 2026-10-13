/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteSegmentedControlElement } from "@mittwald/flow-remote-elements";
import type { RemoteSegmentedControlElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteSegmentedControlElementProps as SegmentedControlProps } from "@mittwald/flow-remote-elements";

export const SegmentedControl: FlowRemoteVueComponent<RemoteSegmentedControlElementProps> =
  createFlowRemoteComponent(
    "flr-segmented-control",
    "SegmentedControl",
    RemoteSegmentedControlElement,
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
