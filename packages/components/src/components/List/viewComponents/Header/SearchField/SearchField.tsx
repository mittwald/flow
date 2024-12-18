import type { FC, KeyboardEvent } from "react";
import React, { useEffect, useState } from "react";
import { useOnChange } from "@/lib/hooks";
import { SearchField as SearchFieldComponent } from "@/components/SearchField";
import type {
  SearchShape,
  SearchValue,
} from "@/components/List/model/search/types";

type TextFieldProps = SearchShape<never>["textFieldProps"];

interface Props extends TextFieldProps {
  onChange?: (value: SearchValue) => void;
  value?: SearchValue;
  autoSubmit?: boolean;
}

const autoSubmitTimeout = 800;

export const SearchField: FC<Props> = (props) => {
  const { onChange, value, autoSubmit, ...textFieldProps } = props;

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

  return (
    <SearchFieldComponent
      value={searchString}
      onKeyUp={handleKeyPress}
      onChange={(value) => setSearchString(value)}
      onClear={clearSearch}
      {...textFieldProps}
    />
  );
};
