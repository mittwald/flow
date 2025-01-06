/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
import type { CalendarProps } from "@mittwald/flow-react-components/Calendar";
export type { CalendarProps } from "@mittwald/flow-react-components/Calendar";

export class RemoteCalendarElement extends FlowRemoteElement<CalendarProps> {
  static get remoteProperties() {
    return {};
  }

  static get remoteEvents() {
    return {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "flr-calendar": InstanceType<typeof RemoteCalendarElement>;
  }
}

customElements.define("flr-calendar", RemoteCalendarElement);
