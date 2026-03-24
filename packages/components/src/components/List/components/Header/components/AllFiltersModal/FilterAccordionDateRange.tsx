import React, { type FC } from "react";
import type { Filter } from "@/components/List/model/filter/Filter";
import ButtonView from "@/views/ButtonView";
import { Flex } from "@/components/Flex";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../../../locales/*.locale.json";
import { RangeCalendar } from "@/components/Calendar";

interface Props {
  filter: Filter<never, never, never>;
}

export const FilterAccordionDateRange: FC<Props> = (props) => {
  const { filter } = props;

  const currentValue = filter.getDateRangeValue();

  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <Flex direction="column" gap="m">
      <RangeCalendar
        {...filter.dateRangeOptions}
        value={currentValue}
        onChange={(range) => {
          filter.setDateRangeValue(range);
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
