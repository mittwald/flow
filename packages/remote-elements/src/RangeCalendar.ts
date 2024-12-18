/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { RangeCalendarProps } from "@mittwald/flow-react-components/RangeCalendar";
export type { RangeCalendarProps } from "@mittwald/flow-react-components/RangeCalendar";

export const RemoteRangeCalendarElement =
  createRemoteElement<RangeCalendarProps>({
    properties: {},
    events: {},
  });

declare global {
  interface HTMLElementTagNameMap {
    "flr-range-calendar": InstanceType<typeof RemoteRangeCalendarElement>;
  }
}

customElements.define("flr-range-calendar", RemoteRangeCalendarElement);
