import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "@/components/Calendar/Calendar.module.scss";
import CalendarHeader from "./components/CalendarHeader";

export const Calendar: FC = () => {
  return (
    <Aria.Calendar className={styles.calendar}>
      <CalendarHeader />
      <Aria.CalendarGrid weekdayStyle="short">
        {(date) => <Aria.CalendarCell date={date} />}
      </Aria.CalendarGrid>
    </Aria.Calendar>
  );
};

export default Calendar;
