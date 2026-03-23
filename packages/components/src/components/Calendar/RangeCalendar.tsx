import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "@/components/Calendar/Calendar.module.scss";
import CalendarHeader from "./components/CalendarHeader";
import clsx from "clsx";

export type RangeCalendarProps = Aria.RangeCalendarProps<Aria.DateValue>;

export const RangeCalendar: FC<RangeCalendarProps> = (props) => {
  const { className } = props;

  const rootClassName = clsx(styles.calendar, styles.range, className);

  return (
    <Aria.RangeCalendar {...props} className={rootClassName}>
      <CalendarHeader />
      <Aria.CalendarGrid>
        {(date) => <Aria.CalendarCell date={date} />}
      </Aria.CalendarGrid>
    </Aria.RangeCalendar>
  );
};

export default RangeCalendar;
