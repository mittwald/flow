import type { FC, ReactNode } from "react";
import React from "react";
import styles from "./Header.module.css";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";
import { TunnelExit } from "@mittwald/react-tunnel";
import type { SearchValue } from "@/components/List/model/search/types";
import { SearchField } from "./SearchField/SearchField";

interface Props extends PropsWithClassName {
  showSearch?: boolean;
  autoSubmitSearch?: boolean;
  onSearchChanged?: (search: SearchValue) => void;
  searchValue?: SearchValue;
  filterPickerList?: ReactNode;
  activeFilterList?: ReactNode;
}

export const Header: FC<Props> = (props) => {
  const {
    className,
    showSearch,
    onSearchChanged,
    autoSubmitSearch,
    searchValue,
    filterPickerList,
    activeFilterList,
  } = props;

  return (
    <div className={clsx(className, styles.header)}>
      <div className={styles.pickerListAndSearch}>
        <div className={styles.pickerList}>{filterPickerList}</div>
        <div className={styles.searchAndActions}>
          {showSearch && (
            <SearchField
              value={searchValue}
              onChange={onSearchChanged}
              autoSubmit={autoSubmitSearch}
            />
          )}
          <TunnelExit id="actions" />
        </div>
      </div>
      {activeFilterList}
    </div>
  );
};

export default Header;
