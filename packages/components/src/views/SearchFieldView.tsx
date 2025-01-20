/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { SearchField, type SearchFieldProps } from "~/components/SearchField";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const SearchFieldView: FC<SearchFieldProps> = (props) => {
  const View = useContext(viewComponentContext)["SearchField"] ?? SearchField;
  return <View {...props} />;
};

export default SearchFieldView;
