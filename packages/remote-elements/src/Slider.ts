/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { SliderProps } from "@mittwald/flow-react-components/Slider";
export type { SliderProps } from "@mittwald/flow-react-components/Slider";

export const RemoteSliderElement = createRemoteElement<SliderProps>({
  properties: {
    showInitialMarker: {},
    wrapWith: {},
    formatOptions: {},
    "aria-label": {},
    "aria-labelledby": {},
    "aria-describedby": {},
    "aria-details": {},
    isDisabled: {},
    value: {},
    defaultValue: {},
    id: {},
    step: {},
    orientation: {},
    minValue: {},
    maxValue: {},
    children: {},
    className: {},
    style: {},
    slot: {},
    name: {},
    ref: {},
    key: {},
  },
  events: {
    change: {},
    changeEnd: {},
  },
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-slider": InstanceType<typeof RemoteSliderElement>;
  }
}

customElements.define("flr-slider", RemoteSliderElement);
