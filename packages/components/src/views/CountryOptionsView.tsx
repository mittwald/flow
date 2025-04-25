/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { CountryOptionsProps } from "@/components/Select";
import React, { useContext } from "react";
import { CountryOptions } from "@/components/Select";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CountryOptionsView: FC<CountryOptionsProps> = (props) => {
  const View =
    useContext(viewComponentContext)["CountryOptions"] ?? CountryOptions;
  return <View {...props} />;
};

export default CountryOptionsView;
