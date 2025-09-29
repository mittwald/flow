/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  SearchField,
  type SearchFieldProps,
} from "@/components/SearchField/SearchField";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SearchFieldView: FC<SearchFieldProps> = memo((props) => {
  const View = useContext(viewComponentContext)["SearchField"] ?? SearchField;
  return <View {...props} />;
});
SearchFieldView.displayName = "SearchFieldView";

export default SearchFieldView;
