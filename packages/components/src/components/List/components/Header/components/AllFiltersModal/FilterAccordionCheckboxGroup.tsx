import React, { type FC } from "react";
import CheckboxGroupView from "@/views/CheckboxGroupView";
import CheckboxView from "@/views/CheckboxView";
import type { Filter } from "@/components/List/model/filter/Filter";

interface Props {
  filter: Filter<never, never, never>;
}

export const FilterAccordionCheckboxGroup: FC<Props> = (props) => {
  const { filter } = props;

  const activeKeys = filter.values.filter((v) => v.isActive).map((v) => v.id);

  const name = filter.name ?? filter.property;

  return (
    <CheckboxGroupView value={activeKeys} m={[1, 1]} aria-label={name}>
      {filter.values.map((v) => (
        <CheckboxView key={v.id} value={v.id} onPress={() => v.toggle()}>
          {v.render()}
        </CheckboxView>
      ))}
    </CheckboxGroupView>
  );
};
