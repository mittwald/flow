/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteSegmentedControlElement } from "@mittwald/flow-remote-elements";
export { type RemoteSegmentedControlElement } from "@mittwald/flow-remote-elements";

export const SegmentedControl = createFlowRemoteComponent(
  "flr-segmented-control",
  "SegmentedControl",
  {
    clearPropsContext: false,
  },
  RemoteSegmentedControlElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onBlur: { event: "blur" } as never,
      onChange: { event: "change" } as never,
      onFocus: { event: "focus" } as never,
      onFocusChange: { event: "focusChange" } as never,
    },
  },
);
