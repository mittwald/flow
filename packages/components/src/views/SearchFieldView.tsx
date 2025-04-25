/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { SearchFieldProps } from "@/components/SearchField";
import React, { useContext } from "react";
import { SearchField } from "@/components/SearchField";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SearchFieldView: FC<SearchFieldProps> = (props) => {
  const View = useContext(viewComponentContext)["SearchField"] ?? SearchField;
  return <View {...props} />;
};

export default SearchFieldView;
