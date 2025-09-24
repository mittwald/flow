/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  FieldDescription,
  type FieldDescriptionProps,
} from "@/components/FieldDescription";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FieldDescriptionView: FC<FieldDescriptionProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["FieldDescription"] ?? FieldDescription;
  return <View {...props} />;
});
FieldDescriptionView.displayName = "FieldDescriptionView";

export default FieldDescriptionView;
