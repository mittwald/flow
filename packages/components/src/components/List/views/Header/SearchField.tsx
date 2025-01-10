import type { FC, KeyboardEvent } from "react";
import React, { useEffect, useState } from "react";
import { useOnChange } from "@/lib/hooks";
import { SearchField as SearchFieldComponent } from "@/components/SearchField";
import type {
  SearchShape,
  SearchValue,
} from "@/components/List/model/search/types";
import styles from "./Header.module.css";
import clsx from "clsx";

type TextFieldProps = SearchShape<never>["textFieldProps"];

export interface SearchFieldProps extends TextFieldProps {
  onChange?: (value: SearchValue) => void;
  value?: SearchValue;
  autoSubmit?: boolean;
}

const autoSubmitTimeout = 800;

/** @flr-generate all */
export const SearchField: FC<SearchFieldProps> = (props) => {
  const { onChange, value, autoSubmit, className, ...textFieldProps } = props;

  const [searchString, setSearchString] = useState(value ?? "");

  const submitSearch = () => {
    if (searchString.trim() === "") {
      onChange?.(undefined);
    } else {
      onChange?.(searchString);
    }
  };

  useEffect(() => {
    if (value) {
      const timeout = setTimeout(() => submitSearch(), autoSubmitTimeout);
      return () => clearTimeout(timeout);
    }
  }, [searchString, autoSubmit]);

  useOnChange(value, () => {
    setSearchString(value ?? "");
  }, [searchString]);

  const clearSearch = () => {
    onChange?.(undefined);
    setSearchString("");
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      submitSearch();
    } else if (e.key === "Escape") {
      clearSearch();
    }
  };

  const rootClassName = clsx(className, styles.searchField);

  return (
    <SearchFieldComponent
      className={rootClassName}
      value={searchString}
      onKeyUp={handleKeyPress}
      onChange={(value) => setSearchString(value)}
      onClear={clearSearch}
      {...textFieldProps}
    />
  );
};
