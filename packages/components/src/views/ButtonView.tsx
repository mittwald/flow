/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { ButtonProps } from "@/components/Button";
import React, { useContext } from "react";
import { Button } from "@/components/Button";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ButtonView: FC<ButtonProps> = (props) => {
  const View = useContext(viewComponentContext)["Button"] ?? Button;
  return <View {...props} />;
};

export default ButtonView;
