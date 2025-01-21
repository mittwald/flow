/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
"use client";
import createFlowRemoteComponent from "~/lib/createFlowRemoteComponent";
import { RemoteSliderElement } from "@mittwald/flow-remote-elements";
export { type RemoteSliderElement } from "@mittwald/flow-remote-elements";

export const Slider = createFlowRemoteComponent(
  "flr-slider",
  "Slider",
  RemoteSliderElement,
  {
    slotProps: {
      wrapper: false,
    },

    eventProps: {
      onChange: { event: "change" } as never,
      onChangeEnd: { event: "changeEnd" } as never,
    },
  },
);
