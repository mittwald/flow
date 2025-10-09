/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { ComboBox, type ComboBoxProps } from "@/components/ComboBox/ComboBox";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ComboBoxView: FC<ComboBoxProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ComboBox"] ?? ComboBox;
  return <View {...props} />;
});
ComboBoxView.displayName = "ComboBoxView";

export default ComboBoxView;
