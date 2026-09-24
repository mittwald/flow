import { type FC } from "react";
import CheckboxGroupView from "@/views/CheckboxGroupView";
import CheckboxView from "@/views/CheckboxView";
import type { Filter } from "@/components/List/model/filter/Filter";
import locales from "../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";

const selectAllCheckboxValue = "FilterSelectAll";

interface Props {
  filter: Filter;
}

export const FilterAccordionCheckboxGroup: FC<Props> = (props) => {
  const { filter } = props;
  const formatter = useLocalizedStringFormatter(locales, "List");

  const activeKeys = filter.values.filter((v) => v.isActive).map((v) => v.id);

  const name = filter.name ?? filter.property;

  const isEveryValueActive = filter.isEveryValueActive();

  const selectAllCheckbox = filter.isSelectAllAvailable && (
    <CheckboxView
      value={selectAllCheckboxValue}
      isIndeterminate={filter.isActive() && !isEveryValueActive}
      onPress={() =>
        isEveryValueActive ? filter.deselectAll() : filter.selectAll()
      }
    >
      {formatter.format("filters.selectAll")}
    </CheckboxView>
  );

  if (selectAllCheckbox && isEveryValueActive) {
    activeKeys.push(selectAllCheckboxValue);
  }

  return (
    <CheckboxGroupView value={activeKeys} m={[1, 1]} aria-label={name}>
      {selectAllCheckbox}
      {filter.values.map((v) => (
        <CheckboxView key={v.id} value={v.id} onPress={() => v.toggle()}>
          {v.render()}
        </CheckboxView>
      ))}
    </CheckboxGroupView>
  );
};
