/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { FieldDescriptionProps } from "@/components/FieldDescription";
import React, { useContext } from "react";
import { FieldDescription } from "@/components/FieldDescription";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FieldDescriptionView: FC<FieldDescriptionProps> = (props) => {
  const View =
    useContext(viewComponentContext)["FieldDescription"] ?? FieldDescription;
  return <View {...props} />;
};

export default FieldDescriptionView;
