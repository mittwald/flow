import React, { FC } from "react";
import { SortingPicker } from "@/components/List/components/Header/SortingPicker";
import FilterPicker from "@/components/List/components/Header/FilterPicker";
import styles from "./Header.module.css";
import clsx from "clsx";
import { ActiveFilters } from "@/components/List/components/Header/ActiveFilters";
import { useList } from "@/components/List/hooks/useList";

interface Props {
  className?: string;
}

// ToDo: Add search

export const Header: FC<Props> = (props) => {
  const { className } = props;
  const list = useList();

  const filterPickerList = list.filters.map((filter) => (
    <FilterPicker key={filter.property} filter={filter} />
  ));

  return (
    <div className={clsx(className, styles.header)}>
      <div className={styles.pickerList}>
        <SortingPicker />
        {filterPickerList}
      </div>
      <ActiveFilters />
    </div>
  );
};

export default Header;
