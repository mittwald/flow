/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Button, type ButtonProps } from "@/components/Button/Button";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ButtonView: FC<ButtonProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Button"] ?? Button;
  return <View {...props} />;
});
ButtonView.displayName = "ButtonView";

export default ButtonView;
