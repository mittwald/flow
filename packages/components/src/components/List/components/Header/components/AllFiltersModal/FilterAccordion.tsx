import React, { type FC } from "react";
import AccordionView from "@/views/AccordionView";
import HeadingView from "@/views/HeadingView";
import ContentView from "@/views/ContentView";
import type { Filter } from "@/components/List/model/filter/Filter";
import { FilterAccordionRadioGroup } from "@/components/List/components/Header/components/AllFiltersModal/FilterAccordionRadioGroup";
import { FilterAccordionCheckboxGroup } from "@/components/List/components/Header/components/AllFiltersModal/FilterAccordionCheckboxGroup";
import { FilterAccordionDateRange } from "@/components/List/components/Header/components/AllFiltersModal/FilterAccordionDateRange";

interface Props {
  filter: Filter<never, never, never>;
}

export const FilterAccordion: FC<Props> = (props) => {
  const { filter } = props;

  const name = filter.name ?? filter.property;

  return (
    <AccordionView>
      <HeadingView>{name}</HeadingView>
      <ContentView>
        {filter.mode === "one" && <FilterAccordionRadioGroup filter={filter} />}
        {(filter.mode === "all" || filter.mode === "some") && (
          <FilterAccordionCheckboxGroup filter={filter} />
        )}
        {filter.mode === "dateRange" && (
          <FilterAccordionDateRange filter={filter} />
        )}
      </ContentView>
    </AccordionView>
  );
};
