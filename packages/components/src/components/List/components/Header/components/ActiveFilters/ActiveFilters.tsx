import type { FC } from "react";
import React from "react";
import { useList } from "@/components/List/hooks/useList";
import styles from "./ActiveFilters.module.scss";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import locales from "../../../../locales/*.locale.json";
import { Translate } from "@/lib/react/components/Translate";

export const ActiveFilters: FC = () => {
  const list = useList();

  const activeFilters = list.filters.flatMap((f) =>
    f.values
      .filter((v) => v.isActive)
      .map((v) => (
        <Button
          variant="soft"
          size="s"
          key={v.id}
          onPress={() => v.deactivate()}
        >
          <Text>{v.render()}</Text>
          <IconClose />
        </Button>
      )),
  );

  if (activeFilters.length <= 0) {
    return null;
  }

  return (
    <div className={styles.activeFilters}>
      {activeFilters}

      <Button
        className={styles.clearButton}
        size="s"
        variant="plain"
        onPress={() => list.clearFilters()}
      >
        <Translate locales={locales}>list.resetAll</Translate>
      </Button>
    </div>
  );
};

export default ActiveFilters;
