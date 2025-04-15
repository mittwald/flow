/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { BigNumber, type BigNumberProps } from "@/components/BigNumber";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const BigNumberView: FC<BigNumberProps> = (props) => {
  const View = useContext(viewComponentContext)["BigNumber"] ?? BigNumber;
  return <View {...props} />;
};

export default BigNumberView;
