/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import { createRemoteElement } from "@remote-dom/core/elements";
import type { CalendarProps } from "@mittwald/flow-react-components/Calendar";
export type { CalendarProps } from "@mittwald/flow-react-components/Calendar";

export const RemoteCalendarElement = createRemoteElement<CalendarProps>({
  properties: {},
  events: {},
});

declare global {
  interface HTMLElementTagNameMap {
    "flr-calendar": InstanceType<typeof RemoteCalendarElement>;
  }
}

customElements.define("flr-calendar", RemoteCalendarElement);
