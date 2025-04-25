/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { OptionProps } from "@/components/Option";
import React, { useContext } from "react";
import { Option } from "@/components/Option";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const OptionView: FC<OptionProps> = (props) => {
  const View = useContext(viewComponentContext)["Option"] ?? Option;
  return <View {...props} />;
};

export default OptionView;
