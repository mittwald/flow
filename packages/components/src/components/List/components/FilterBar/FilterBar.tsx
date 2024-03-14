import React, { FC } from "react";
import { SortingPicker } from "@/components/List/components/FilterBar/components/SortingPicker/SortingPicker";
import FilterPicker from "@/components/List/components/FilterBar/components/FilterPicker";
import styles from "./FilterBar.module.css";
import clsx from "clsx";
import { FilterPickedItems } from "@/components/List/components/FilterBar/components/FilterPickedItems";

interface Props {
  className?: string;
}

export const FilterBar: FC<Props> = (props) => {
  const { className } = props;

  return (
    <div className={clsx(className, styles.filterBar)}>
      <div style={{ display: "flex" }}>
        <SortingPicker />
        <FilterPicker />
      </div>
      <FilterPickedItems />
    </div>
  );
};

export default FilterBar;
