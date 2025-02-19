/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Button, type ButtonProps } from "@/components/Button";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ButtonView: FC<ButtonProps> = (props) => {
  const View = useContext(viewComponentContext)["Button"] ?? Button;
  return <View {...props} />;
};

export default ButtonView;
