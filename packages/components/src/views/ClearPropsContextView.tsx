/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  ClearPropsContext,
  type ClearPropsContextProps,
} from "@/components/ClearPropsContext";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ClearPropsContextView: FC<ClearPropsContextProps> = (props) => {
  const View =
    useContext(viewComponentContext)["ClearPropsContext"] ?? ClearPropsContext;
  return <View {...props} />;
};

export default ClearPropsContextView;
