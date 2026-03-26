import type { FC } from "react";
import ButtonView from "@/views/ButtonView";
import headerStyles from "@/components/List/components/Header/Header.module.css";
import TextView from "@/views/TextView";
import type { Filter } from "@/components/List/model/filter/Filter";
import { IconFilter } from "@/components/Icon/components/icons";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../../../locales/*.locale.json";
import { Popover, PopoverTrigger } from "@/components/Popover";
import styles from "./FilterContextMenus.module.scss";
import { useOverlayController } from "@/lib/controller";
import RangeCalendarView from "@/views/RangeCalendarView";

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
        <RangeCalendarView
          {...filter.dateRangeOptions}
          value={filter.getDateRangeValue()}
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
