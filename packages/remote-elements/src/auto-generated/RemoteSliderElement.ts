/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { SliderProps as RemoteSliderElementProps } from "@mittwald/flow-react-components/Slider";
export type { SliderProps as RemoteSliderElementProps } from "@mittwald/flow-react-components/Slider";

export class RemoteSliderElement extends FlowRemoteElement<RemoteSliderElementProps> {
  static get remoteProperties() {
    return {
      showInitialMarker: {},
      formatOptions: {},
      "aria-label": {},
      "aria-labelledby": {},
      "aria-describedby": {},
      "aria-details": {},
      minValue: {},
      maxValue: {},
      isDisabled: {},
      value: {},
      defaultValue: {},
      id: {},
      orientation: {},
      step: {},
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

  static get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-slider": InstanceType<typeof RemoteSliderElement>;
  }
}

customElements.define("flr-slider", RemoteSliderElement);
