import type { FC } from "react";
import ButtonView from "@/views/ButtonView";
import headerStyles from "@/components/List/components/Header/Header.module.css";
import TextView from "@/views/TextView";
import { IconFilter } from "@/components/Icon/components/icons";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../../../locales/*.locale.json";
import { Popover, PopoverTrigger } from "@/components/Popover";
import styles from "./FilterContextMenus.module.scss";
import { useOverlayController } from "@/lib/controller";
import RangeCalendarView from "@/views/RangeCalendarView";
import type { AnyDateRangeFilter } from "@/components/List/model/filter/types";

interface Props {
  filter: AnyDateRangeFilter;
}

export const DateRangeFilterPopover: FC<Props> = (props) => {
  const { filter } = props;

  const { name, property } = filter;

  const stringFormatter = useLocalizedStringFormatter(locales, "List");

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
        aria-label={stringFormatter.format("dateRange")}
      >
        <RangeCalendarView
          {...filter.dateRangeOptions}
          value={filter.getValue()}
          onChange={(range) => {
            filter.setValue(range);
            controller.close();
          }}
          className={styles.calendar}
        />
      </Popover>
    </PopoverTrigger>
  );
};
