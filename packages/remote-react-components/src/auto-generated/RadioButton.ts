/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteRadioButtonElement } from "@mittwald/flow-remote-elements";
export { type RemoteRadioButtonElement } from "@mittwald/flow-remote-elements";

export const RadioButton = createFlowRemoteComponent(
  "flr-radio-button",
  "RadioButton",
  {
    clearPropsContext: true,
  },
  RemoteRadioButtonElement,
  {
    slotProps: {
      wrapper: false,
    },
    eventProps: {
      onBlur: { event: "blur" } as never,
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
