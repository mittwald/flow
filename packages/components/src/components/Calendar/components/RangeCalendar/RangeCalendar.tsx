import React from "react";
import * as Aria from "react-aria-components";
import styles from "@/components/Calendar/Calendar.module.scss";
import CalendarHeader from "../CalendarHeader";
import clsx from "clsx";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface RangeCalendarProps
  extends
    FlowComponentProps,
    Omit<Aria.RangeCalendarProps<Aria.DateValue>, "children"> {}

/** @flr-generate all */
export const RangeCalendar = flowComponent("RangeCalendar", (props) => {
  const { className, ref: ignoredRef, ...rest } = props;

  const rootClassName = clsx(styles.calendar, styles.range, className);

  return (
    <Aria.RangeCalendar {...rest} className={rootClassName}>
      <CalendarHeader />
      <Aria.CalendarGrid>
        {(date) => <Aria.CalendarCell date={date} />}
      </Aria.CalendarGrid>
    </Aria.RangeCalendar>
  );
});

export default RangeCalendar;
