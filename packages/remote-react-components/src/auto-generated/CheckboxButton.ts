/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteCheckboxButtonElement } from "@mittwald/flow-remote-elements";
export { type RemoteCheckboxButtonElement } from "@mittwald/flow-remote-elements";

export const CheckboxButton = createFlowRemoteComponent(
  "flr-checkbox-button",
  "CheckboxButton",
  {
    clearPropsContext: true,
  },
  RemoteCheckboxButtonElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onBlur: { event: "blur" } as never,
      onChange: { event: "change" } as never,
      onFocus: { event: "focus" } as never,
      onFocusChange: { event: "focusChange" } as never,
      onHoverChange: { event: "hoverChange" } as never,
      onHoverEnd: { event: "hoverEnd" } as never,
      onHoverStart: { event: "hoverStart" } as never,
      onKeyDown: { event: "keyDown" } as never,
      onKeyUp: { event: "keyUp" } as never,
    },
  },
);
