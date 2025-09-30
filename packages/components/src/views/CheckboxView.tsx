/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Checkbox, type CheckboxProps } from "@/components/Checkbox";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CheckboxView: FC<CheckboxProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Checkbox"] ?? Checkbox;
  return <View {...props} />;
});
CheckboxView.displayName = "CheckboxView";

export default CheckboxView;
