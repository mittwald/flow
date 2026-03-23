import type { FC } from "react";
import ButtonView from "@/views/ButtonView";
import headerStyles from "@/components/List/components/Header/Header.module.css";
import TextView from "@/views/TextView";
import type { Filter } from "@/components/List/model/filter/Filter";
import { IconFilter } from "@/components/Icon/components/icons";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../../../locales/*.locale.json";
import { RangeCalendar } from "@/components/Calendar";
import { Popover, PopoverTrigger } from "@/components/Popover";
import type { DateRange } from "react-aria-components";
import styles from "./FilterContextMenus.module.scss";
import { useOverlayController } from "@/lib/controller";

interface Props {
  filter: Filter<never, never, never>;
}

export const DateRangeFilterPopover: FC<Props> = (props) => {
  const { filter } = props;

  const { name, property } = filter;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const controller = useOverlayController("Popover");

  return (
    <PopoverTrigger controller={controller}>
      <ButtonView
        className={headerStyles.hideOnMobile}
        variant="outline"
        color="secondary"
      >
        <TextView>{name ?? property}</TextView>
        <IconFilter />
      </ButtonView>
      <Popover
        placement="bottom end"
        isDialogContent
        aria-label={stringFormatter.format("list.dateRange")}
      >
        <RangeCalendar
          {...filter.dateRangeOptions}
          value={filter.getValue() as DateRange}
          onChange={(range) => {
            filter.setDateRangeValue(range);
            controller.close();
          }}
          className={styles.calendar}
        />
      </Popover>
    </PopoverTrigger>
  );
};
