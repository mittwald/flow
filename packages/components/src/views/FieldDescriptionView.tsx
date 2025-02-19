/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  FieldDescription,
  type FieldDescriptionProps,
} from "@/components/FieldDescription";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FieldDescriptionView: FC<FieldDescriptionProps> = (props) => {
  const View =
    useContext(viewComponentContext)["FieldDescription"] ?? FieldDescription;
  return <View {...props} />;
};

export default FieldDescriptionView;
