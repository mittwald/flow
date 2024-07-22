import type { FC, KeyboardEvent } from "react";
import React, { createElement, useState } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import type { Search } from "@/components/List/model/search/Search";
import type { SearchFieldRenderComponent } from "@/components/List/model/search/types";
import { useOnChange } from "@/lib/hooks";
import { SearchField as SearchFieldComponent } from "@/components/SearchField";

interface Props extends PropsWithClassName {
  search: Search<never>;
}

const DefaultSearchFieldRender: SearchFieldRenderComponent = (props) => {
  const { className, onChange, value, ...textFieldProps } = props;

  const [searchString, setSearchString] = useState(value ?? "");

  useOnChange(value, () => {
    setSearchString(value ?? "");
  }, [searchString]);

  const clearSearch = () => {
    onChange(undefined);
    setSearchString("");
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (searchString.trim() === "") {
        onChange(undefined);
      } else {
        onChange(searchString);
      }
    } else if (e.key === "Escape") {
      clearSearch();
    }
  };

  return (
    <SearchFieldComponent
      className={className}
      value={searchString}
      onKeyUp={handleKeyPress}
      onChange={(value) => setSearchString(value)}
      onClear={clearSearch}
      {...textFieldProps}
    />
  );
};

export const SearchField: FC<Props> = (props) => {
  const { className, search } = props;
  const render = search.render ?? DefaultSearchFieldRender;

  return createElement(render, {
    className,
    value: search.value,
    onChange: search.setValue.bind(search),
    ...search.textFieldProps,
  });
};
