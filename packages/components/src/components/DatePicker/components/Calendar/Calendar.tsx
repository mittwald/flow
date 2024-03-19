import React, { FC } from "react";
import * as Aria from "react-aria-components";
import styles from "@/components/Calendar/Calendar.module.css";
import { CalendarHeader } from "@/components/Calendar";

export const Calendar: FC = () => {
  return (
    <Aria.Calendar className={styles.calendar}>
      <CalendarHeader />
      <Aria.CalendarGrid>
        {(date) => <Aria.CalendarCell date={date} />}
      </Aria.CalendarGrid>
    </Aria.Calendar>
  );
};

export default Calendar;
