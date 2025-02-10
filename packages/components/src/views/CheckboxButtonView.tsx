/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  CheckboxButton,
  type CheckboxButtonProps,
} from "@/components/CheckboxButton";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CheckboxButtonView: FC<CheckboxButtonProps> = (props) => {
  const View =
    useContext(viewComponentContext)["CheckboxButton"] ?? CheckboxButton;
  return <View {...props} />;
};

export default CheckboxButtonView;
