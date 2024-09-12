import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "@/components/Calendar/Calendar.module.css";
import { CalendarHeader } from "@/components/Calendar";

export const RangeCalendar: FC = () => {
  return (
    <Aria.RangeCalendar className={styles.calendar}>
      <CalendarHeader />
      <Aria.CalendarGrid>
        {(date) => <Aria.CalendarCell date={date} />}
      </Aria.CalendarGrid>
    </Aria.RangeCalendar>
  );
};

export default RangeCalendar;
