import type { FC, KeyboardEvent } from "react";
import React, { createElement, useState } from "react";
import { TextField } from "@/components/TextField";
import type { PropsWithClassName } from "@/lib/types/props";
import locales from "../../../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import type { Search } from "@/components/List/model/search/Search";
import type { SearchFieldRenderComponent } from "@/components/List/model/search/types";
import { useOnChange } from "@/lib/hooks";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";

interface Props extends PropsWithClassName {
  search: Search<never>;
}

const DefaultSearchFieldRender: SearchFieldRenderComponent = (props) => {
  const { className, onChange, value } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);
  const [searchString, setSearchString] = useState(value ?? "");

  useOnChange(value, () => {
    setSearchString(value ?? "");
  }, [searchString]);

  const label = stringFormatter.format("list.search");

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
    <div className={className}>
      <TextField
        // @todo: remove style when dedicated <SearchField /> exists
        style={{ flexGrow: "1" }}
        aria-label={label}
        placeholder={label}
        value={searchString}
        onKeyUp={handleKeyPress}
        onChange={(value) => setSearchString(value)}
      />
      {/* @todo: remove Button when dedicated <SearchField /> exists */}
      <Button
        color="secondary"
        variant="plain"
        onPress={clearSearch}
        isDisabled={!searchString}
        excludeFromTabOrder
      >
        <IconClose />
      </Button>
    </div>
  );
};

export const SearchField: FC<Props> = (props) => {
  const { className, search } = props;
  const render = search.render ?? DefaultSearchFieldRender;

  return createElement(render, {
    className,
    value: search.value,
    onChange: search.setValue.bind(search),
  });
};
