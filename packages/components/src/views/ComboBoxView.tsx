/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { ComboBox, type ComboBoxProps } from "@/components/ComboBox";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ComboBoxView: FC<ComboBoxProps> = (props) => {
  const View = useContext(viewComponentContext)["ComboBox"] ?? ComboBox;
  return <View {...props} />;
};

export default ComboBoxView;
