/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Option, type OptionProps } from "~/components/Select";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const OptionView: FC<OptionProps> = (props) => {
  const View = useContext(viewComponentContext)["Option"] ?? Option;
  return <View {...props} />;
};

export default OptionView;
