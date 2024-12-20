import type { FC, PropsWithChildren } from "react";
import React, { Children } from "react";
import styles from "./ActiveFilterList.module.scss";
import { Button } from "@/components/Button";
import { IconDelete, IconSave } from "@/components/Icon/components/icons";
import locales from "../../../locales/*.locale.json";
import { Translate } from "@/lib/react/components/Translate";
import { useLocalizedStringFormatter } from "react-aria";
import { Tooltip, TooltipTrigger } from "@/components/Tooltip";
import { Icon } from "@/components/Icon";
import { IconArrowBackUp } from "@tabler/icons-react";

interface Props extends PropsWithChildren {
  onResetFilters?: () => void;
  onClearFilters?: () => void;
  onStoreFilterDefaultSettings?: () => void;
  someFiltersChanged?: boolean;
}

export const ActiveFilterList: FC<Props> = (props) => {
  const {
    onResetFilters,
    onClearFilters,
    onStoreFilterDefaultSettings,
    someFiltersChanged,
    children,
  } = props;
  const formatter = useLocalizedStringFormatter(locales);

  const storeFiltersButton = onStoreFilterDefaultSettings &&
    someFiltersChanged && (
      <TooltipTrigger>
        <Tooltip>
          <Translate locales={locales}>list.filters.store</Translate>
        </Tooltip>
        <Button
          size="s"
          variant="plain"
          color="secondary"
          onPress={onStoreFilterDefaultSettings}
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
        onPress={onResetFilters}
        aria-label={formatter.format("list.filters.reset")}
      >
        <Icon>
          <IconArrowBackUp />
        </Icon>
      </Button>
    </TooltipTrigger>
  ) : undefined;

  const clearFiltersButton =
    Children.count(children) > 0 ? (
      <TooltipTrigger>
        <Tooltip>
          <Translate locales={locales}>list.filters.clear</Translate>
        </Tooltip>
        <Button
          size="s"
          variant="plain"
          color="secondary"
          onPress={onClearFilters}
        >
          <Icon>
            <IconDelete />
          </Icon>
        </Button>
      </TooltipTrigger>
    ) : undefined;

  if (
    Children.count(children) === 0 &&
    !storeFiltersButton &&
    !resetFiltersButton
  ) {
    return null;
  }

  return (
    <div className={styles.activeFilters}>
      {children}
      {storeFiltersButton}
      {resetFiltersButton}
      {clearFiltersButton}
    </div>
  );
};

export default ActiveFilterList;
