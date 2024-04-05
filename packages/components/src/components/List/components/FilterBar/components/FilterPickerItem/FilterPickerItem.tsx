import type { FC } from "react";
import React from "react";
import type { Filter } from "@/components/List/model/filter/Filter";
import { Button } from "@/components/Button";
import styles from "./FilterPickerItem.module.css";
import { Label } from "@/components/Label";

import type { AnyData } from "@/components/List/model/item/types";

interface Props {
  filter: Filter<AnyData>;
}

export const FilterPickerItem: FC<Props> = (props) => {
  const { filter } = props;

  const values = filter.values;

  const valueButtons = values.map((v) => (
    <Button
      variant={filter.isValueActive(v) ? "primary" : "secondary"}
      key={filter.getValueId(v)}
      onPress={() => filter.toggleValue(v)}
    >
      {String(v)}
    </Button>
  ));

  return (
    <div className={styles.filterPickerItem}>
      <Label>{filter.property}</Label>
      <div className={styles.items}>{valueButtons}</div>
    </div>
  );
};
