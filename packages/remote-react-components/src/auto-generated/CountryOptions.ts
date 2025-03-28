/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
import { RemoteCountryOptionsElement } from "@mittwald/flow-remote-elements";
export { type RemoteCountryOptionsElement } from "@mittwald/flow-remote-elements";

export const CountryOptions = createFlowRemoteComponent(
  "flr-country-options",
  "CountryOptions",
  {
    clearPropsContext: false,
  },
  RemoteCountryOptionsElement,
  {
    slotProps: {
      wrapper: "flr-slot-root-wrapper",
    },
    eventProps: {
      onAction: { event: "action" } as never,
      onBlur: { event: "blur" } as never,
      onFocus: { event: "focus" } as never,
      onFocusChange: { event: "focusChange" } as never,
      onScroll: { event: "scroll" } as never,
      onSelectionChange: { event: "selectionChange" } as never,
    },
  },
);
