import React, { FC } from "react";
import * as Aria from "react-aria-components";
import styles from "./RangeCalendar.module.css";
import { CalendarHeader } from "@/components/CalendarBase";

export const RangeCalendar: FC = () => {
  return (
    <Aria.RangeCalendar className={styles.root}>
      <CalendarHeader />
      <Aria.CalendarGrid>
        {(date) => <Aria.CalendarCell date={date} />}
      </Aria.CalendarGrid>
    </Aria.RangeCalendar>
  );
};

export default RangeCalendar;
