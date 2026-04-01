import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "@/components/Calendar/Calendar.module.scss";
import CalendarHeader from "./components/CalendarHeader";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";

export const Calendar: FC<PropsWithClassName> = (props) => {
  const { className } = props;

  const rootClassName = clsx(styles.calendar, className);

  return (
    <Aria.Calendar className={rootClassName}>
      <CalendarHeader />
      <Aria.CalendarGrid weekdayStyle="short">
        {(date) => <Aria.CalendarCell date={date} />}
      </Aria.CalendarGrid>
    </Aria.Calendar>
  );
};

export default Calendar;
