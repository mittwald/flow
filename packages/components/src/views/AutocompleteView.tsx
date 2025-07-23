/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  Autocomplete,
  type AutocompleteProps,
} from "@/components/Autocomplete";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const AutocompleteView: FC<AutocompleteProps> = (props) => {
  const View = useContext(viewComponentContext)["Autocomplete"] ?? Autocomplete;
  return <View {...props} />;
};

export default AutocompleteView;
