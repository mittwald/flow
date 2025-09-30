/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { FieldError, type FieldErrorProps } from "@/components/FieldError";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FieldErrorView: FC<FieldErrorProps> = memo((props) => {
  const View = useContext(viewComponentContext)["FieldError"] ?? FieldError;
  return <View {...props} />;
});
FieldErrorView.displayName = "FieldErrorView";

export default FieldErrorView;
