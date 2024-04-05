import type { FC } from "react";
import React from "react";
import { SortingPickerItem } from "@/components/List/components/FilterBar/components/SortingPickerItem/SortingPickerItem";
import { useList } from "@/components/List/hooks/useList";
import styles from "./SortingPicker.module.css";

export const SortingPicker: FC = () => {
  const { sorting } = useList();

  const pickerItems = sorting.map((s) => (
    <SortingPickerItem sorting={s} key={s.getTableColumn().id} />
  ));

  return (
    <div className={styles.sortingPicker}>
      <div className={styles.items}>{pickerItems}</div>
    </div>
  );
};
