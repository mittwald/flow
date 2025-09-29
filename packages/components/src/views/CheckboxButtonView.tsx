/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  CheckboxButton,
  type CheckboxButtonProps,
} from "@/components/CheckboxButton/CheckboxButton";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CheckboxButtonView: FC<CheckboxButtonProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["CheckboxButton"] ?? CheckboxButton;
  return <View {...props} />;
});
CheckboxButtonView.displayName = "CheckboxButtonView";

export default CheckboxButtonView;
