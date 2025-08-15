import type { FC, KeyboardEvent } from "react";
import { createElement, useEffect, useState } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import type { Search } from "@/components/List/model/search/Search";
import type { SearchFieldRenderComponent } from "@/components/List/model/search/types";
import { useOnChange } from "@/lib/hooks";
import SearchFieldView from "@/views/SearchFieldView";
import styles from "./SearchField.module.scss";
import { useAriaAnnounceSearchState } from "@/components/List/hooks/useAriaAnnounceSearchState";

interface Props extends PropsWithClassName {
  search: Search<never>;
}

const autoSubmitTimeout = 800;

const DefaultSearchFieldRender: SearchFieldRenderComponent = (props) => {
  const { onChange, value, autoSubmit = true, ...searchFieldProps } = props;

  const [searchString, setSearchString] = useState(value ?? "");

  const submitSearch = () => {
    if (searchString.trim() === "") {
      onChange(undefined);
    } else {
      onChange(searchString);
    }
  };

  useEffect(() => {
    if (autoSubmit) {
      const timeout = setTimeout(() => submitSearch(), autoSubmitTimeout);
      return () => clearTimeout(timeout);
    }
  }, [searchString, autoSubmit]);

  useAriaAnnounceSearchState();

  useOnChange(value, () => {
    setSearchString(value ?? "");
  }, [searchString]);

  const clearSearch = () => {
    onChange(undefined);
    setSearchString("");
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      submitSearch();
    } else if (e.key === "Escape") {
      clearSearch();
    }
  };

  return (
    <SearchFieldView
      className={styles.searchField}
      value={searchString}
      onKeyUp={handleKeyPress}
      onChange={(value) => setSearchString(value)}
      onClear={clearSearch}
      {...searchFieldProps}
    />
  );
};

export const SearchField: FC<Props> = (props) => {
  const { search } = props;
  const render = search.render ?? DefaultSearchFieldRender;

  return createElement(render, {
    value: search.value,
    onChange: search.setValue.bind(search),
    ...search.textFieldProps,
  });
};

export default SearchField;
