import { type FC } from "react";
import * as Aria from "react-aria-components";
import styles from "@/components/Calendar/Calendar.module.scss";
import CalendarHeader from "../CalendarHeader";
import clsx from "clsx";
import { MenuItem } from "@/components/MenuItem";
import { useCalendarDateRangePresets } from "@/components/Calendar/components/RangeCalendar/helpers/useCalendarDateRangePresets";
import { Separator } from "@/components/Separator";
import type { DateRangePickerProps } from "@/components/DateRangePicker";
import {
  SkeletonModeReset,
  useSkeletonMode,
} from "@/components/SkeletonMode/skeletonModeContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export type RangeCalendarProps = Omit<
  Aria.RangeCalendarProps<Aria.DateValue>,
  "children" | "ref"
> &
  Pick<DateRangePickerProps, "withDatePickerPresets"> &
  FlowComponentProps<HTMLDivElement> & {
    children?: never;
  };

/** @internal */
const InnerRangeCalendar: FC<RangeCalendarProps> = ({
  withDatePickerPresets,
}) => {
  const dateRangeHelper = useCalendarDateRangePresets(withDatePickerPresets);

  const predefinedDateHelperItems = dateRangeHelper.map((present) => {
    return (
      <MenuItem
        key={present.label}
        isDisabled={present.disabled}
        onPress={present.onPress}
        aria-label={present.label}
      >
        {present.label}
      </MenuItem>
    );
  });

  return (
    <div className={styles.container}>
      {withDatePickerPresets && (
        <>
          <Aria.Menu className={styles.presetMenu}>
            {predefinedDateHelperItems}
          </Aria.Menu>
          <Separator
            orientation="vertical"
            className={styles.presetSeparator}
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
export const RangeCalendar = flowComponent("RangeCalendar", (props) => {
  const { className, withDatePickerPresets, ref, ...rest } = props;
  const isSkeleton = useSkeletonMode();

  const rootClassName = clsx(
    styles.calendar,
    styles.range,
    isSkeleton && styles.skeleton,
    className,
  );

  return (
    <Aria.RangeCalendar
      {...rest}
      ref={ref}
      className={rootClassName}
      inert={isSkeleton || undefined}
    >
      {/* The calendar is one skeleton surface, its content draws none. */}
      <SkeletonModeReset>
        <InnerRangeCalendar withDatePickerPresets={withDatePickerPresets} />
      </SkeletonModeReset>
    </Aria.RangeCalendar>
  );
});

export default RangeCalendar;
