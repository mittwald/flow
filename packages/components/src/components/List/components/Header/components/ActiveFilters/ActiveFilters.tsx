import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import styles from "./ActiveFilters.module.scss";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { IconDelete, IconSave } from "@/components/Icon/components/icons";
import locales from "../../../../locales/*.locale.json";
import { Translate } from "@/lib/react/components/Translate";
import { observer } from "mobx-react-lite";
import useLocalizedStringFormatter from "@/lib/i18n/useLocalizedStringFormatter";
import { Tooltip, TooltipTrigger } from "@/components/Tooltip";
import { Icon } from "@/components/Icon";
import { IconArrowBackUp } from "@tabler/icons-react";
import { Badge } from "@/components/Badge";

export const ActiveFilters: FC = observer(() => {
  const list = useList();
  const formatter = useLocalizedStringFormatter(locales);

  const activeFilterValues = list.filters
    .flatMap((f) => f.values)
    .filter((v) => v.isActive);

  const activeFilters = activeFilterValues.map((v) => (
    <Badge key={v.id} onClose={() => v.deactivate()}>
      <Text>{v.render()}</Text>
    </Badge>
  ));

  const someFiltersChanged =
    list.filters.filter((f) => f.hasChanged()).length > 0;

  const storeFiltersButton = list.supportsSettingsStorage &&
    someFiltersChanged && (
      <TooltipTrigger>
        <Tooltip>
          <Translate locales={locales}>list.filters.store</Translate>
        </Tooltip>
        <Button
          size="s"
          variant="plain"
          color="secondary"
          onPress={() => list.storeFilterDefaultSettings()}
          aria-label={formatter.format("list.filters.store")}
        >
          <IconSave />
        </Button>
      </TooltipTrigger>
    );

  const resetFiltersButton = someFiltersChanged ? (
    <TooltipTrigger>
      <Tooltip>
        <Translate locales={locales}>list.filters.reset</Translate>
      </Tooltip>
      <Button
        size="s"
        variant="plain"
        color="secondary"
        onPress={() => list.resetFilters()}
        aria-label={formatter.format("list.filters.reset")}
      >
        <Icon>
          <IconArrowBackUp />
        </Icon>
      </Button>
    </TooltipTrigger>
  ) : undefined;

  const removeAllFiltersButton =
    activeFilters.length > 0 ? (
      <TooltipTrigger>
        <Tooltip>
          <Translate locales={locales}>list.filters.clear</Translate>
        </Tooltip>
        <Button
          size="s"
          variant="plain"
          color="secondary"
          onPress={() => list.clearFilters()}
        >
          <Icon>
            <IconDelete />
          </Icon>
        </Button>
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
    <div className={styles.activeFilters}>
      {activeFilters}
      {storeFiltersButton}
      {resetFiltersButton}
      {removeAllFiltersButton}
    </div>
  );
});

export default ActiveFilters;
