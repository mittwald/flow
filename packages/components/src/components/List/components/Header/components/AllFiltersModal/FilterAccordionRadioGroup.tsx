import React, { type FC } from "react";
import RadioGroupView from "@/views/RadioGroupView";
import RadioView from "@/views/RadioView";
import type { Filter } from "@/components/List/model/filter/Filter";
import ButtonView from "@/views/ButtonView";
import { Flex } from "@/components/Flex";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../../../locales/*.locale.json";

interface Props {
  filter: Filter;
}

export const FilterAccordionRadioGroup: FC<Props> = (props) => {
  const { filter } = props;

  const activeKeys = filter.values.filter((v) => v.isActive).map((v) => v.id);

  const name = filter.name ?? filter.property;

  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <Flex direction="column" gap="m">
      <RadioGroupView
        value={activeKeys[0]}
        m={[1, 1]}
        key={activeKeys[0]}
        aria-label={name}
      >
        {filter.values.map((v) => (
          <RadioView
            key={v.id}
            value={v.id}
            onPress={() => {
              if (!v.isActive) {
                v.toggle();
              }
            }}
          >
            {v.render()}
          </RadioView>
        ))}
      </RadioGroupView>
      {activeKeys.length > 0 && (
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
