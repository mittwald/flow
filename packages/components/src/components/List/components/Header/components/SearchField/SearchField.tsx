import type { FC, KeyboardEvent } from "react";
import { createElement, useEffect, useEffectEvent, useState } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import type { Search } from "@/components/List/model/search/Search";
import type { SearchFieldRenderComponent } from "@/components/List/model/search/types";
import { useOnChange } from "@/lib/hooks";
import SearchFieldView from "@/views/SearchFieldView";
import styles from "./SearchField.module.scss";
import { useAriaAnnounceSearchState } from "@/components/List/hooks/useAriaAnnounceSearchState";

interface Props extends PropsWithClassName {
  search: Search<never>;
  isDisabled?: boolean;
}

const autoSubmitTimeout = 500;

const DefaultSearchFieldRender: SearchFieldRenderComponent = (props) => {
  const { onChange, value, autoSubmit = true, ...searchFieldProps } = props;

  const [searchString, setSearchString] = useState(value ?? "");
  const [previousSearchString, setPreviousSearchString] = useState("");

  const submitSearch = () => {
    if (searchString.trim() === "") {
      onChange(undefined);
    } else if (previousSearchString !== searchString) {
      setPreviousSearchString(searchString);
      onChange(searchString);
    }
  };

  const autoSubmitSearch = useEffectEvent(submitSearch);

  useEffect(() => {
    if (autoSubmit) {
      const timeout = setTimeout(() => autoSubmitSearch(), autoSubmitTimeout);
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
    if (e.key === "Enter" && !autoSubmit) {
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
  const { search, isDisabled } = props;

  const render = search.render ?? DefaultSearchFieldRender;

  return createElement(render, {
    // autoFocus only acts on mount, and a disabled field cannot take focus –
    // remount once the initial loading enables it.
    key: isDisabled ? "disabled" : "enabled",
    value: search.value,
    onChange: search.setValue.bind(search),
    isDisabled,
    ...search.textFieldProps,
  });
};

export default SearchField;
