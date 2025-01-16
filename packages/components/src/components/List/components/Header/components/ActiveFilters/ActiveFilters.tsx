import type { FC } from "react";
import React from "react";
import { useList } from "~/components/List/hooks/useList";
import styles from "./ActiveFilters.module.scss";
import { Text } from "~/components/Text";
import { Button } from "~/components/Button";
import locales from "../../../../locales/*.locale.json";
import { Translate } from "~/lib/react/components/Translate";
import { observer } from "mobx-react-lite";
import { useLocalizedStringFormatter } from "react-aria";
import { Tooltip, TooltipTrigger } from "~/components/Tooltip";
import { Badge } from "~/components/Badge";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponent";
import { Div } from "~/components/Div";
import { IconSave, IconUndo } from "~/components/Icon/components/icons";
import { Icon } from "~/components/Icon";
import { IconX } from "@tabler/icons-react";

export const ActiveFilters: FC = observer(() => {
  const list = useList();
  const formatter = useLocalizedStringFormatter(locales);

  const activeFilterValues = list.filters
    .flatMap((f) => f.values)
    .filter((v) => v.isActive);

  const { DivView, ButtonView, TextView, BadgeView, TooltipView } =
    useViewComponents(
      ["Button", Button],
      ["Text", Text],
      ["Badge", Badge],
      ["Tooltip", Tooltip],
      ["Div", Div],
    );

  const activeFilters = activeFilterValues.map((v) => (
    <BadgeView key={v.id} onClose={() => v.deactivate()}>
      <TextView>{v.render()}</TextView>
    </BadgeView>
  ));

  const someFiltersChanged =
    list.filters.filter((f) => f.hasChanged()).length > 0;

  const storeFiltersButton = list.supportsSettingsStorage &&
    someFiltersChanged && (
      <TooltipTrigger>
        <TooltipView>
          <Translate locales={locales}>list.filters.store</Translate>
        </TooltipView>
        <ButtonView
          size="s"
          variant="plain"
          color="secondary"
          onPress={() => list.storeFilterDefaultSettings()}
          aria-label={formatter.format("list.filters.store")}
        >
          <IconSave />
        </ButtonView>
      </TooltipTrigger>
    );

  const resetFiltersButton = someFiltersChanged ? (
    <TooltipTrigger>
      <TooltipView>
        <Translate locales={locales}>list.filters.reset</Translate>
      </TooltipView>
      <ButtonView
        size="s"
        variant="plain"
        color="secondary"
        onPress={() => list.resetFilters()}
        aria-label={formatter.format("list.filters.reset")}
      >
        <IconUndo />
      </ButtonView>
    </TooltipTrigger>
  ) : undefined;

  const { IconView } = useViewComponents(["Icon", Icon]);

  const removeAllFiltersButton =
    activeFilters.length > 0 ? (
      <TooltipTrigger>
        <TooltipView>
          <Translate locales={locales}>list.filters.clear</Translate>
        </TooltipView>
        <ButtonView
          size="s"
          variant="plain"
          color="secondary"
          onPress={() => list.clearFilters()}
        >
          <IconView>
            <IconX />
          </IconView>
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
