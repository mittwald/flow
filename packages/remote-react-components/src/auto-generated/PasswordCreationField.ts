/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemotePasswordCreationFieldElement } from "@mittwald/flow-remote-elements";
export { type RemotePasswordCreationFieldElement } from "@mittwald/flow-remote-elements";

export const PasswordCreationField = createFlowRemoteComponent(
  "flr-password-creation-field",
  "PasswordCreationField",
  {
    clearPropsContext: true,
  },
  RemotePasswordCreationFieldElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onBeforeInput: { event: "beforeInput" } as never,
      onBlur: { event: "blur" } as never,
      onChange: { event: "change" } as never,
      onCompositionEnd: { event: "compositionEnd" } as never,
      onCompositionStart: { event: "compositionStart" } as never,
      onCompositionUpdate: { event: "compositionUpdate" } as never,
      onCopy: { event: "copy" } as never,
      onCut: { event: "cut" } as never,
      onFocus: { event: "focus" } as never,
      onFocusChange: { event: "focusChange" } as never,
      onInput: { event: "input" } as never,
      onKeyDown: { event: "keyDown" } as never,
      onKeyUp: { event: "keyUp" } as never,
      onPaste: { event: "paste" } as never,
      onSelect: { event: "select" } as never,
    },
  },
);
