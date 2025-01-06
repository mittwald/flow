/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { RangeCalendarProps } from "@mittwald/flow-react-components/RangeCalendar";
export type { RangeCalendarProps } from "@mittwald/flow-react-components/RangeCalendar";

export class RemoteRangeCalendarElement extends FlowRemoteElement<RangeCalendarProps> {
  static get remoteProperties() {
    return {};
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-range-calendar": InstanceType<typeof RemoteRangeCalendarElement>;
  }
}

customElements.define("flr-range-calendar", RemoteRangeCalendarElement);
