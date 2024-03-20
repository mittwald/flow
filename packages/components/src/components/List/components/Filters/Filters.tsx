import React, { FC } from "react";
import { SortingPicker } from "@/components/List/components/Filters/components/SortingPicker";
import FilterPicker from "@/components/List/components/Filters/components/FilterPicker";
import styles from "./Filters.module.css";
import clsx from "clsx";
import { ActiveFilters } from "@/components/List/components/Filters/components/ActiveFilters";
import { useList } from "@/components/List/hooks/useList";

interface Props {
  className?: string;
}

// ToDo: Add search

export const Filters: FC<Props> = (props) => {
  const { className } = props;
  const list = useList();

  const filterPickerList = list.filters.map((filter) => (
    <FilterPicker key={filter.property} filter={filter} />
  ));

  return (
    <div className={clsx(className, styles.filters)}>
      <div className={styles.filterBar}>
        <SortingPicker />
        {filterPickerList}
      </div>
      <ActiveFilters />
    </div>
  );
};

export default Filters;
