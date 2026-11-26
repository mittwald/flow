import { type FC } from "react";
import ButtonView from "@/views/ButtonView";
import FlexView from "@/views/FlexView";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../../../locales/*.locale.json";
import RangeCalendarView from "@/views/RangeCalendarView";
import type { AnyDateRangeFilter } from "@/components/List/model/filter/types";
import { isDateRangeValue } from "@/components/Calendar";
import { DateTimeRangeFields } from "@/components/List/components/Header/components/DateTimeRangeFields/DateTimeRangeFields";

interface Props {
  filter: AnyDateRangeFilter;
}

export const FilterAccordionDateRange: FC<Props> = (props) => {
  const { filter } = props;

  const currentValue = filter.getValue();

  const stringFormatter = useLocalizedStringFormatter(locales, "List");

  return (
    <FlexView direction="column" gap="m">
      {filter.granularity === "minute" ? (
        <DateTimeRangeFields filter={filter} />
      ) : (
        <RangeCalendarView
          {...filter.rangeCalendarProps}
          value={isDateRangeValue(currentValue) ? currentValue : null}
          onChange={(range) => {
            filter.setValue(range);
          }}
        />
      )}
      {currentValue && (
        <ButtonView
          size="s"
          color="secondary"
          variant="soft"
          onPress={() => filter.clear()}
        >
          {stringFormatter.format("filters.clearSelection")}
        </ButtonView>
      )}
    </FlexView>
  );
};
