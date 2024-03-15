import React, { FC } from "react";
import { useList } from "@/components/List/hooks/useList";
import { Badge } from "@/components/Badge";
import styles from "./ActiveFilters.module.scss";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import locales from "../../../../locales/*.locale.json";
import { useMessageFormatter } from "react-aria";

export const ActiveFilters: FC = () => {
  const list = useList();
  const stringFormatter = useMessageFormatter(locales);

  const activeFilters = list.filters
    .map((f) =>
      f.values
        .filter((v) => f.isValueActive(v))
        .map((v) => (
          <Badge key={String(v)}>
            <Text>{String(v)}</Text>
            <Button onPress={() => f.deactivateValue(v)}>
              <IconClose />
            </Button>
          </Badge>
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
        {stringFormatter("resetFilters")}
      </Button>
    </div>
  );
};

export default ActiveFilters;
