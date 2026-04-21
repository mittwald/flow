import React, { type FC } from "react";
import * as Aria from "react-aria-components";
import styles from "@/components/Calendar/Calendar.module.scss";
import CalendarHeader from "../CalendarHeader";
import clsx from "clsx";
import { MenuItem } from "@/components/MenuItem";
import { useCalendarDateRangePresets } from "@/components/Calendar/components/RangeCalendar/helpers/useCalendarDateRangePresets";
import { Separator } from "@/components/Separator";
import { useMediaQuery } from "usehooks-ts";
import type { DateRangePickerProps } from "@/components/DateRangePicker";

export type RangeCalendarProps = Omit<
  Aria.RangeCalendarProps<Aria.DateValue>,
  "children"
> &
  Pick<DateRangePickerProps, "withDatePickerPresets" | "datePickerPresets">;

/** @internal */
const InnerRangeCalendar: FC<RangeCalendarProps> = ({
  withDatePickerPresets,
  datePickerPresets,
}) => {
  const isSmallViewport = useMediaQuery("(max-width: 530px)");
  const dateRangeHelper = useCalendarDateRangePresets(datePickerPresets);

  const predefinedDateHelperItems = dateRangeHelper.map((present) => {
    return (
      <MenuItem
        key={present.label}
        isDisabled={present.disabled}
        onPress={present.onPress}
      >
        {present.label}
      </MenuItem>
    );
  });

  return (
    <div className={styles.container}>
      {withDatePickerPresets && (
        <>
          <Aria.Menu>{predefinedDateHelperItems}</Aria.Menu>
          <Separator
            orientation={isSmallViewport ? "horizontal" : "vertical"}
          />
        </>
      )}
      <div>
        <CalendarHeader />
        <Aria.CalendarGrid>
          {(date) => <Aria.CalendarCell date={date} />}
        </Aria.CalendarGrid>
      </div>
    </div>
  );
};

/** @flr-generate all */
export const RangeCalendar: FC<RangeCalendarProps> = (props) => {
  const { className, withDatePickerPresets, datePickerPresets, ...rest } =
    props;
  const rootClassName = clsx(styles.calendar, styles.range, className);

  return (
    <Aria.RangeCalendar {...rest} className={rootClassName}>
      <InnerRangeCalendar
        withDatePickerPresets={withDatePickerPresets}
        datePickerPresets={datePickerPresets}
      />
    </Aria.RangeCalendar>
  );
};

export default RangeCalendar;
