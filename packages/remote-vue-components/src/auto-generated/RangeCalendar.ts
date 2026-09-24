/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteRangeCalendarElement } from "@mittwald/flow-remote-elements";
import type { RemoteRangeCalendarElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteRangeCalendarElementProps as RangeCalendarProps } from "@mittwald/flow-remote-elements";

export const RangeCalendar: FlowRemoteVueComponent<RemoteRangeCalendarElementProps> =
  createFlowRemoteComponent(
    "flr-range-calendar",
    "RangeCalendar",
    RemoteRangeCalendarElement,
    {
      booleans: [
        "allowsNonContiguousRanges",
        "autoFocus",
        "hidden",
        "inert",
        "isDisabled",
        "isInvalid",
        "isReadOnly",
      ],
    },
  );
