/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { ProgressBarProps } from "@mittwald/flow-react-components/ProgressBar";
export type { ProgressBarProps } from "@mittwald/flow-react-components/ProgressBar";

export const RemoteProgressBarElement = createRemoteElement<ProgressBarProps>({
  properties: {
    showMaxValue: {},
    size: {},
    "aria-label": {},
    "aria-labelledby": {},
    "aria-describedby": {},
    "aria-details": {},
    className: {},
    style: {},
    value: {},
    id: {},
    slot: {},
    isIndeterminate: {},
    minValue: {},
    maxValue: {},
    formatOptions: {},
    valueLabel: {},
    children: {},
    status: {},
  },
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-progress-bar": InstanceType<typeof RemoteProgressBarElement>;
  }
}

customElements.define("flr-progress-bar", RemoteProgressBarElement);
