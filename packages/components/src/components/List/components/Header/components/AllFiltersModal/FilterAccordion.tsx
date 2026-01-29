import React, { type FC } from "react";
import AccordionView from "@/views/AccordionView";
import HeadingView from "@/views/HeadingView";
import ContentView from "@/views/ContentView";
import RadioGroupView from "@/views/RadioGroupView";
import RadioView from "@/views/RadioView";
import CheckboxGroupView from "@/views/CheckboxGroupView";
import CheckboxView from "@/views/CheckboxView";
import type { Filter } from "@/components/List/model/filter/Filter";

interface Props {
  filter: Filter<never, never, never>;
}

export const FilterAccordion: FC<Props> = (props) => {
  const { filter } = props;

  const activeKeys = filter.values.filter((v) => v.isActive).map((v) => v.id);

  return (
    <AccordionView>
      <HeadingView>{filter.name ?? filter.property}</HeadingView>
      <ContentView>
        {filter.mode === "one" && (
          <RadioGroupView value={activeKeys[0]} m={[1, 1]}>
            {filter.values.map((v) => (
              <RadioView value={v.id} onPress={() => v.toggle()}>
                {v.render()}
              </RadioView>
            ))}
          </RadioGroupView>
        )}
        {filter.mode !== "one" && (
          <CheckboxGroupView value={activeKeys} m={[1, 1]}>
            {filter.values.map((v) => (
              <CheckboxView value={v.id} onPress={() => v.toggle()}>
                {v.render()}
              </CheckboxView>
            ))}
          </CheckboxGroupView>
        )}
      </ContentView>
    </AccordionView>
  );
};
