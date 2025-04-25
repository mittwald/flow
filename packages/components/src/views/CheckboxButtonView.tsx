/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { CheckboxButtonProps } from "@/components/CheckboxButton";
import React, { useContext } from "react";
import { CheckboxButton } from "@/components/CheckboxButton";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CheckboxButtonView: FC<CheckboxButtonProps> = (props) => {
  const View =
    useContext(viewComponentContext)["CheckboxButton"] ?? CheckboxButton;
  return <View {...props} />;
};

export default CheckboxButtonView;
