import type { FC } from "react";
import * as Aria from "react-aria-components";
import styles from "@/components/Calendar/Calendar.module.scss";
import CalendarHeader from "./components/CalendarHeader";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import {
  SkeletonModeReset,
  useSkeletonMode,
} from "@/components/SkeletonMode/skeletonModeContext";

export const Calendar: FC<PropsWithClassName> = (props) => {
  const { className } = props;

  const isSkeleton = useSkeletonMode();

  const rootClassName = clsx(
    styles.calendar,
    isSkeleton && styles.skeleton,
    className,
  );

  return (
    <Aria.Calendar className={rootClassName} inert={isSkeleton || undefined}>
      {/* The calendar is one skeleton surface, its content draws none. */}
      <SkeletonModeReset>
        <CalendarHeader />
        <Aria.CalendarGrid weekdayStyle="short">
          {(date) => <Aria.CalendarCell date={date} />}
        </Aria.CalendarGrid>
      </SkeletonModeReset>
    </Aria.Calendar>
  );
};

export default Calendar;
