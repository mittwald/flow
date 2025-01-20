/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Select, type SelectProps } from "~/components/Select";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const SelectView: FC<SelectProps> = (props) => {
  const View = useContext(viewComponentContext)["Select"] ?? Select;
  return <View {...props} />;
};

export default SelectView;
