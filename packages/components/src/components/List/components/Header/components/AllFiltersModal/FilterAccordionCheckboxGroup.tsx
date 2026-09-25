import { type FC } from "react";
import CheckboxGroupView from "@/views/CheckboxGroupView";
import CheckboxView from "@/views/CheckboxView";
import type { Filter } from "@/components/List/model/filter/Filter";
import locales from "../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import styles from "../FilterContextMenu/FilterSelectAll.module.scss";

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
      className={styles.selectAllCheckbox}
      isSelected={isEveryValueActive}
      isIndeterminate={filter.isActive() && !isEveryValueActive}
      onChange={() =>
        isEveryValueActive ? filter.deselectAll() : filter.selectAll()
      }
    >
      {formatter.format(
        isEveryValueActive ? "filters.deselectAll" : "filters.selectAll",
      )}
    </CheckboxView>
  );

  return (
    <>
      {selectAllCheckbox}
      <CheckboxGroupView value={activeKeys} m={[1, 1]} aria-label={name}>
        {filter.values.map((v) => (
          <CheckboxView key={v.id} value={v.id} onPress={() => v.toggle()}>
            {v.render()}
          </CheckboxView>
        ))}
      </CheckboxGroupView>
    </>
  );
};
