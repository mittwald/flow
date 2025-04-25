/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ClearPropsContextContentProps } from "@/components/ClearPropsContext";
import React, { useContext } from "react";
import { ClearPropsContextContent } from "@/components/ClearPropsContext";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ClearPropsContextContentView: FC<ClearPropsContextContentProps> = (
  props,
) => {
  const View =
    useContext(viewComponentContext)["ClearPropsContextContent"] ??
    ClearPropsContextContent;
  return <View {...props} />;
};

export default ClearPropsContextContentView;
