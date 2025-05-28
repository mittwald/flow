/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteButtonElement } from "@mittwald/flow-remote-elements";
export { type RemoteButtonElement } from "@mittwald/flow-remote-elements";

export const Button = createFlowRemoteComponent(
  "flr-button",
  "Button",
  {
    clearPropsContext: true,
  },
  RemoteButtonElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onBlur: { event: "blur" } as never,
      onClick: { event: "click" } as never,
      onFocus: { event: "focus" } as never,
      onFocusChange: { event: "focusChange" } as never,
      onHoverChange: { event: "hoverChange" } as never,
      onHoverEnd: { event: "hoverEnd" } as never,
      onHoverStart: { event: "hoverStart" } as never,
      onKeyDown: { event: "keyDown" } as never,
      onKeyUp: { event: "keyUp" } as never,
      onPress: { event: "press" } as never,
      onPressChange: { event: "pressChange" } as never,
      onPressEnd: { event: "pressEnd" } as never,
      onPressStart: { event: "pressStart" } as never,
      onPressUp: { event: "pressUp" } as never,
    },
  },
);
