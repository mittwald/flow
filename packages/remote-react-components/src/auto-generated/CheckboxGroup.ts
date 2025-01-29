/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/lib/createFlowRemoteComponent";
import { RemoteCheckboxGroupElement } from "@mittwald/flow-remote-elements";
export { type RemoteCheckboxGroupElement } from "@mittwald/flow-remote-elements";

export const CheckboxGroup = createFlowRemoteComponent(
  "flr-checkbox-group",
  "CheckboxGroup",
  RemoteCheckboxGroupElement,
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
