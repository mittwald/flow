/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Radio, type RadioProps } from "@/components/RadioGroup";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const RadioView: FC<RadioProps> = (props) => {
  const View = useContext(viewComponentContext)["Radio"] ?? Radio;
  return <View {...props} />;
};

export default RadioView;
