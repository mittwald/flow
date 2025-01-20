/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  CheckboxGroup,
  type CheckboxGroupProps,
} from "~/components/CheckboxGroup";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const CheckboxGroupView: FC<CheckboxGroupProps> = (props) => {
  const View =
    useContext(viewComponentContext)["CheckboxGroup"] ?? CheckboxGroup;
  return <View {...props} />;
};

export default CheckboxGroupView;
