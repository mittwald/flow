import type { FC } from "react";
import { useList } from "@/components/List/hooks/useList";
import styles from "./ActiveFilters.module.scss";
import locales from "../../../../locales/*.locale.json";
import { observer } from "mobx-react-lite";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import { TooltipTrigger } from "@/components/Tooltip";
import {
  IconClose,
  IconSave,
  IconUndo,
} from "@/components/Icon/components/icons";
import ButtonView from "@/views/ButtonView";
import TooltipView from "@/views/TooltipView";
import DivView from "@/views/DivView";
import BadgeView from "@/views/BadgeView";
import TooltipTriggerView from "@/views/TooltipTriggerView";
import TextView from "@/views/TextView";
import { Filter } from "@/components/List/model/filter/Filter";
import { transformDateValueToFormattedDate } from "@/lib/date/transformDateValueToFormattedDate";
import { DateRangeFilter } from "@/components/List/model/filter/DateRangeFilter";

export const ActiveFilters: FC = observer(() => {
  const list = useList();
  const formatter = useLocalizedStringFormatter(locales, "List.ActiveFilters");

  const activeFilters = list.filters.flatMap((f) => {
    if (f instanceof DateRangeFilter) {
      const value = f.getValue();
      if (value) {
        return [
          <BadgeView key={f.name} onClose={() => f.clear()}>
            <TextView>
              {`${transformDateValueToFormattedDate(value.start)} - ${transformDateValueToFormattedDate(value.end)}`}
            </TextView>
          </BadgeView>,
        ];
      }
    }

    return f.values
      .filter((v) => v.isActive)
      .map((v) => (
        <BadgeView key={v.id} onClose={() => v.deactivate()}>
          <TextView>{v.render()}</TextView>
        </BadgeView>
      ));
  });

  const storingAvailable = list.filters.some((f) => f.isStoringAvailable());
  const hasChanges = list.filters.some((f) => f.hasChanges());

  const storeFiltersButton = storingAvailable && hasChanges && (
    <TooltipTriggerView>
      <TooltipView>{formatter.format("filters.store")}</TooltipView>
      <ButtonView
        size="s"
        variant="plain"
        color="secondary"
        onPress={() =>
          Filter.storeFilters(list, { autosave: false, manualSave: true })
        }
        aria-label={formatter.format("filters.store")}
      >
        <IconSave />
      </ButtonView>
    </TooltipTriggerView>
  );

  const resetFiltersButton = hasChanges ? (
    <TooltipTrigger>
      <TooltipView>{formatter.format("filters.reset")}</TooltipView>
      <ButtonView
        size="s"
        variant="plain"
        color="secondary"
        onPress={() => list.resetFilters()}
        aria-label={formatter.format("filters.reset")}
      >
        <IconUndo />
      </ButtonView>
    </TooltipTrigger>
  ) : undefined;

  const removeAllFiltersButton =
    activeFilters.length > 1 ? (
      <TooltipTrigger>
        <TooltipView>{formatter.format("filters.clear")}</TooltipView>
        <ButtonView
          size="s"
          variant="plain"
          color="secondary"
          onPress={() => list.clearFilters()}
        >
          <IconClose />
        </ButtonView>
      </TooltipTrigger>
    ) : undefined;

  if (
    activeFilters.length === 0 &&
    !storeFiltersButton &&
    !resetFiltersButton
  ) {
    return null;
  }

  return (
    <DivView className={styles.activeFilters}>
      {activeFilters}
      {storeFiltersButton}
      {resetFiltersButton}
      {removeAllFiltersButton}
    </DivView>
  );
});

export default ActiveFilters;
