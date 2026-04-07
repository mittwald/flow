import React, { type FC } from "react";
import ButtonView from "@/views/ButtonView";
import { Flex } from "@/components/Flex";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../../../locales/*.locale.json";
import RangeCalendarView from "@/views/RangeCalendarView";
import type { AnyDateRangeFilter } from "@/components/List/model/filter/types";

interface Props {
  filter: AnyDateRangeFilter;
}

export const FilterAccordionDateRange: FC<Props> = (props) => {
  const { filter } = props;

  const currentValue = filter.getValue();

  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <Flex direction="column" gap="m">
      <RangeCalendarView
        {...filter.dateRangeOptions}
        value={currentValue}
        onChange={(range) => {
          filter.setValue(range);
        }}
      />
      {currentValue && (
        <ButtonView
          size="s"
          color="secondary"
          variant="soft"
          onPress={() => filter.clear()}
        >
          {stringFormatter.format("list.filters.clearSelection")}
        </ButtonView>
      )}
    </Flex>
  );
};
