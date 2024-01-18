import React, { FC } from "react";
import * as Aria from "react-aria-components";
import styles from "../../../../styles/Calendar.module.css";
import { CalendarHeader } from "@/components/CalendarBase";

export const Calendar: FC = () => {
  return (
    <Aria.Calendar className={styles.root}>
      <CalendarHeader />
      <Aria.CalendarGrid>
        {(date) => <Aria.CalendarCell date={date} />}
      </Aria.CalendarGrid>
    </Aria.Calendar>
  );
};

export default Calendar;
