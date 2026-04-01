import React, { type FC } from "react";
import * as Aria from "react-aria-components";
import styles from "@/components/Calendar/Calendar.module.scss";
import CalendarHeader from "../CalendarHeader";
import clsx from "clsx";

export type RangeCalendarProps = Omit<
  Aria.RangeCalendarProps<Aria.DateValue>,
  "children"
>;

/** @flr-generate all */
export const RangeCalendar: FC<RangeCalendarProps> = (props) => {
  const { className, ...rest } = props;

  const rootClassName = clsx(styles.calendar, styles.range, className);

  return (
    <Aria.RangeCalendar {...rest} className={rootClassName}>
      <CalendarHeader />
      <Aria.CalendarGrid>
        {(date) => <Aria.CalendarCell date={date} />}
      </Aria.CalendarGrid>
    </Aria.RangeCalendar>
  );
};

export default RangeCalendar;
