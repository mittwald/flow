import React, { type FC } from "react";
import AccordionView from "@/views/AccordionView";
import HeadingView from "@/views/HeadingView";
import ContentView from "@/views/ContentView";
import type { Filter } from "@/components/List/model/filter/Filter";
import { FilterAccordionRadioGroup } from "@/components/List/components/Header/components/AllFiltersModal/FilterAccordionRadioGroup";
import { FilterAccordionCheckboxGroup } from "@/components/List/components/Header/components/AllFiltersModal/FilterAccordionCheckboxGroup";
import { FilterAccordionDateRange } from "@/components/List/components/Header/components/AllFiltersModal/FilterAccordionDateRange";
import { DateRangeFilter } from "@/components/List/model/filter/DateRangeFilter";

interface Props {
  filter: Filter | DateRangeFilter;
}

export const FilterAccordion: FC<Props> = (props) => {
  const { filter } = props;

  const name = filter.name ?? filter.property;

  const content =
    filter instanceof DateRangeFilter ? (
      <FilterAccordionDateRange filter={filter} />
    ) : filter.mode === "one" ? (
      <FilterAccordionRadioGroup filter={filter} />
    ) : (
      <FilterAccordionCheckboxGroup filter={filter} />
    );

  return (
    <AccordionView>
      <HeadingView>{name}</HeadingView>
      <ContentView>{content}</ContentView>
    </AccordionView>
  );
};
