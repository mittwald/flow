/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Checkbox, type CheckboxProps } from "~/components/Checkbox";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const CheckboxView: FC<CheckboxProps> = (props) => {
  const View = useContext(viewComponentContext)["Checkbox"] ?? Checkbox;
  return <View {...props} />;
};

export default CheckboxView;
