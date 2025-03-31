/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteRadioGroupElement } from "@mittwald/flow-remote-elements";
export { type RemoteRadioGroupElement } from "@mittwald/flow-remote-elements";

export const RadioGroup = createFlowRemoteComponent(
  "flr-radio-group",
  "RadioGroup",
  {
    clearPropsContext: false,
  },
  RemoteRadioGroupElement,
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
