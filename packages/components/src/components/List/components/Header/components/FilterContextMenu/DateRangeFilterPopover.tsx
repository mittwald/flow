import type { FC } from "react";
import ButtonView from "@/views/ButtonView";
import headerStyles from "@/components/List/components/Header/Header.module.scss";
import TextView from "@/views/TextView";
import { IconFilter } from "@/components/Icon/components/icons";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../../../locales/*.locale.json";
import { Popover, PopoverTrigger } from "@/components/Popover";
import styles from "./FilterContextMenus.module.scss";
import { useOverlayController } from "@/lib/controller";
import RangeCalendarView from "@/views/RangeCalendarView";
import type { AnyDateRangeFilter } from "@/components/List/model/filter/types";
import { isDateRangeValue } from "@/components/Calendar";
import { DateTimeRangeFields } from "@/components/List/components/Header/components/DateTimeRangeFields/DateTimeRangeFields";

interface Props {
  filter: AnyDateRangeFilter;
  isDisabled?: boolean;
}

export const DateRangeFilterPopover: FC<Props> = (props) => {
  const { filter, isDisabled } = props;

  const { name, property } = filter;

  const stringFormatter = useLocalizedStringFormatter(locales, "List");

  const controller = useOverlayController("Popover");

  const value = filter.getValue();

  const fields =
    filter.granularity === "minute" ? (
      <DateTimeRangeFields filter={filter} className={styles.dateTimeRange} />
    ) : (
      <RangeCalendarView
        {...filter.rangeCalendarProps}
        value={isDateRangeValue(value) ? value : null}
        onChange={(range) => {
          filter.setValue(range);
          controller.close();
        }}
        className={styles.calendar}
      />
    );

  return (
    <PopoverTrigger controller={controller}>
      <ButtonView
        className={headerStyles.hideOnMobile}
        variant="outline"
        color="secondary"
        isDisabled={isDisabled}
      >
        <TextView>{name ?? property}</TextView>
        <IconFilter />
      </ButtonView>
      <Popover
        placement="bottom end"
        isDialogContent
        aria-label={stringFormatter.format("dateRange")}
      >
        {fields}
      </Popover>
    </PopoverTrigger>
  );
};
