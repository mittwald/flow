/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteCheckboxElement } from "@mittwald/flow-remote-elements";
export type { RemoteCheckboxElement } from "@mittwald/flow-remote-elements";

export const Checkbox = createFlowRemoteComponent(
  "flr-checkbox",
  "Checkbox",
  {
    clearPropsContext: true,
  },
  RemoteCheckboxElement,
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
