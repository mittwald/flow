/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteDateRangePickerElement } from "@mittwald/flow-remote-elements";
export { type RemoteDateRangePickerElement } from "@mittwald/flow-remote-elements";

export const DateRangePicker = createFlowRemoteComponent(
  "flr-date-range-picker",
  "DateRangePicker",
  {
    clearPropsContext: true,
  },
  RemoteDateRangePickerElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onBlur: { event: "blur" } as never,
      onChange: { event: "change" } as never,
      onFocus: { event: "focus" } as never,
      onFocusChange: { event: "focusChange" } as never,
      onKeyDown: { event: "keyDown" } as never,
      onKeyUp: { event: "keyUp" } as never,
      onOpenChange: { event: "openChange" } as never,
    },
  },
);
