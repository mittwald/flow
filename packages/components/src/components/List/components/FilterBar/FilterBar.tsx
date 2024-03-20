import React, { FC } from "react";
import { SortingPicker } from "@/components/List/components/FilterBar/components/SortingPicker/SortingPicker";
import FilterPicker from "@/components/List/components/FilterBar/components/FilterPicker";
import styles from "./FilterBar.module.css";
import clsx from "clsx";

interface Props {
  className?: string;
}

export const FilterBar: FC<Props> = (props) => {
  const { className } = props;

  return (
    <div className={clsx(className, styles.filterBar)}>
      <SortingPicker />
      <FilterPicker />
    </div>
  );
};

export default FilterBar;
