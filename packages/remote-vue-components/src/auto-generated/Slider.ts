/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
import type { FlowRemoteVueComponent } from "@/lib/types";
import { RemoteSliderElement } from "@mittwald/flow-remote-elements";
import type { RemoteSliderElementProps } from "@mittwald/flow-remote-elements";
export { type RemoteSliderElementProps as SliderProps } from "@mittwald/flow-remote-elements";

export const Slider: FlowRemoteVueComponent<RemoteSliderElementProps> =
  createFlowRemoteComponent("flr-slider", "Slider", RemoteSliderElement, {
    booleans: [
      "hidden",
      "inert",
      "isDisabled",
      "isInvalid",
      "isReadOnly",
      "showInitialMarker",
      "sliderOnly",
    ],
  });
