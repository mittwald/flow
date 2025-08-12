/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  CountryOptions,
  type CountryOptionsProps,
} from "@/components/CountryOptions";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CountryOptionsView: FC<CountryOptionsProps> = (props) => {
  const View =
    useContext(viewComponentContext)["CountryOptions"] ?? CountryOptions;
  return <View {...props} />;
};

export default CountryOptionsView;
