/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Fragment, type FragmentProps } from "@/components/Fragment";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FragmentView: FC<FragmentProps> = (props) => {
  const View = useContext(viewComponentContext)["Fragment"] ?? Fragment;
  return <View {...props} />;
};

export default FragmentView;
