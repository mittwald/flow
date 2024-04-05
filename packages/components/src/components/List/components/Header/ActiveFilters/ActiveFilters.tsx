import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import styles from "./ActiveFilters.module.scss";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import locales from "../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

export const ActiveFilters: FC = () => {
  const list = useList();
  const stringFormatter = useLocalizedStringFormatter(locales);

  const activeFilters = list.filters
    .map((f) =>
      f.values
        .filter((v) => f.isValueActive(v))
        .map((v) => (
          <Button
            style="soft"
            size="s"
            key={String(v)}
            onPress={() => f.deactivateValue(v)}
          >
            <Text>{String(v)}</Text>
            <IconClose />
          </Button>
        )),
    )
    .flat();

  if (activeFilters.length <= 0) {
    return null;
  }

  return (
    <div className={styles.activeFilters}>
      {activeFilters}

      <Button
        className={styles.clearButton}
        size="s"
        style="plain"
        onPress={() => list.filters.map((f) => f.clearValues())}
      >
        {stringFormatter.format("resetFilters")}
      </Button>
    </div>
  );
};

export default ActiveFilters;
