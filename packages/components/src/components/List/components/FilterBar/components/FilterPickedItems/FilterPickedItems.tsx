import React, { FC } from "react";
import { useList } from "@/components/List/hooks/useList";
import { Badge } from "@/components/Badge";
import styles from "./FilterPickedItems.module.scss";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";

export const FilterPickedItems: FC = () => {
  const list = useList();

  const pickedItems = list.filters
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

  console.log(pickedItems);

  return (
    <div className={styles.filterPickedItems}>
      {pickedItems}
      {pickedItems.length > 0 && (
        <Button
          className={styles.clearButton}
          size="s"
          style="plain"
          onPress={() => {
            console.log(list.filters.map((f) => f.clearValues()));
          }}
        >
          reset
        </Button>
      )}
    </div>
  );
};

export default FilterPickedItems;
