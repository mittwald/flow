import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "@/components/Calendar/Calendar.module.scss";
import CalendarHeader from "./components/CalendarHeader";
import clsx from "clsx";

type Props = Aria.RangeCalendarProps<Aria.DateValue>;

export const RangeCalendar: FC<Props> = (props) => {
  return (
    <Aria.RangeCalendar
      {...props}
      className={clsx(styles.calendar, styles.range)}
    >
      <CalendarHeader />
      <Aria.CalendarGrid>
        {(date) => <Aria.CalendarCell date={date} />}
      </Aria.CalendarGrid>
    </Aria.RangeCalendar>
  );
};

export default RangeCalendar;
