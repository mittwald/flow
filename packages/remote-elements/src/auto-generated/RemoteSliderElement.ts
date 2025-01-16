/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "~/lib/FlowRemoteElement";
import type { SliderProps as RemoteSliderElementProps } from "@mittwald/flow-react-components/Slider";
export type { SliderProps as RemoteSliderElementProps } from "@mittwald/flow-react-components/Slider";

export class RemoteSliderElement extends FlowRemoteElement<RemoteSliderElementProps> {
  static override get remoteAttributes() {
    return [];
  }

  static override get remoteProperties() {
    return {
      "aria-describedby": {},
      "aria-details": {},
      "aria-label": {},
      "aria-labelledby": {},
      className: {},
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

  static override get remoteEvents() {
    return {
      change: {},
      changeEnd: {},
    };
  }

  static override get remoteSlots() {
    return [];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-slider": InstanceType<typeof RemoteSliderElement>;
  }
}

customElements.define("flr-slider", RemoteSliderElement);
