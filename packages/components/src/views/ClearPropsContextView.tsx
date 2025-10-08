/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ClearPropsContext,
  type ClearPropsContextProps,
} from "@/components/ClearPropsContext/ClearPropsContext";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ClearPropsContextView: FC<ClearPropsContextProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["ClearPropsContext"] ?? ClearPropsContext;
  return <View {...props} />;
});
ClearPropsContextView.displayName = "ClearPropsContextView";

export default ClearPropsContextView;
