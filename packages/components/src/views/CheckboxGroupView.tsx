/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { CheckboxGroupProps } from "@/components/CheckboxGroup";
import React, { useContext } from "react";
import { CheckboxGroup } from "@/components/CheckboxGroup";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CheckboxGroupView: FC<CheckboxGroupProps> = (props) => {
  const View =
    useContext(viewComponentContext)["CheckboxGroup"] ?? CheckboxGroup;
  return <View {...props} />;
};

export default CheckboxGroupView;
