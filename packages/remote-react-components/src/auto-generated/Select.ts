/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteSelectElement } from "@mittwald/flow-remote-elements";
export { type RemoteSelectElement } from "@mittwald/flow-remote-elements";

export const Select = createFlowRemoteComponent(
  "flr-select",
  "Select",
  {
    clearPropsContext: true,
  },
  RemoteSelectElement,
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
      onSelectionChange: { event: "selectionChange" } as never,
    },
  },
);
