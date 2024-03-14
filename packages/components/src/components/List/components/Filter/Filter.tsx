import React, { FC } from "react";
import { SortingPicker } from "@/components/List/components/Filter/components/SortingPicker/SortingPicker";
import FilterPicker from "@/components/List/components/Filter/components/FilterPicker";
import styles from "./Filter.module.css";
import clsx from "clsx";
import { ActiveFilters } from "@/components/List/components/Filter/components/ActiveFilters";
import { useList } from "@/components/List/hooks/useList";

interface Props {
  className?: string;
}

export const Filter: FC<Props> = (props) => {
  const { className } = props;
  const list = useList();

  const filterPickerList = list.filters.map((filter) => (
    <FilterPicker key={filter.property} filter={filter} />
  ));

  return (
    <div className={clsx(className, styles.filter)}>
      <div className={styles.filterBar}>
        <SortingPicker />
        {filterPickerList}
      </div>
      <ActiveFilters />
    </div>
  );
};

export default Filter;
