/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteSegmentedControlElement } from "@mittwald/flow-remote-elements";
export { type RemoteSegmentedControlElement } from "@mittwald/flow-remote-elements";

export const SegmentedControl = createFlowRemoteComponent(
  "flr-segmented-control",
  "SegmentedControl",
  RemoteSegmentedControlElement,
  {
    slotProps: {
      wrapper: false,
    },
    eventProps: {
      onBlur: { event: "blur" } as never,
      onChange: { event: "change" } as never,
      onFocus: { event: "focus" } as never,
      onFocusChange: { event: "focusChange" } as never,
    },
  },
);
