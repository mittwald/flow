/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@mittwald/flow-remote-core";
import type { SliderProps as RemoteSliderElementProps } from "@mittwald/flow-react-components/Slider";
export type { SliderProps as RemoteSliderElementProps } from "@mittwald/flow-react-components/Slider";

export class RemoteSliderElement extends FlowRemoteElement<RemoteSliderElementProps> {
  static get remoteAttributes() {
    return [];
  }

  static get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      defaultValue: {},
      formatOptions: {},
      id: {},
      isDisabled: {},
      maxValue: {},
      minValue: {},
      name: {},
      orientation: {},
      showInitialMarker: {},
      slot: {},
      step: {},
      value: {},
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
