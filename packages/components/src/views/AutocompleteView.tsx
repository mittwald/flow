/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  Autocomplete,
  type AutocompleteProps,
} from "@/components/Autocomplete/Autocomplete";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AutocompleteView: FC<AutocompleteProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Autocomplete"] ?? Autocomplete;
  return <View {...props} />;
});
AutocompleteView.displayName = "AutocompleteView";

export default AutocompleteView;
