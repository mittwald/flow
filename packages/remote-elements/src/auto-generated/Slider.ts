/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SliderProps } from "@mittwald/flow-react-components/Slider";
export type { SliderProps } from "@mittwald/flow-react-components/Slider";

export class RemoteSliderElement extends FlowRemoteElement<SliderProps> {
  static get remoteProperties() {
    return {
      showInitialMarker: {},
      wrapWith: {},
      formatOptions: {},
      minValue: {},
      maxValue: {},
      isDisabled: {},
      value: {},
      defaultValue: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      id: {},
      orientation: {},
      step: {},
      children: {},
      className: {},
      style: {},
      slot: {},
      name: {},
    };
  }

  static get remoteEvents() {
    return {
      change: {},
      changeEnd: {},
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-slider": InstanceType<typeof RemoteSliderElement>;
  }
}

customElements.define("flr-slider", RemoteSliderElement);
