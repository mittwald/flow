/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { InitialsProps } from "@/components/Initials";
import React, { useContext } from "react";
import { Initials } from "@/components/Initials";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const InitialsView: FC<InitialsProps> = (props) => {
  const View = useContext(viewComponentContext)["Initials"] ?? Initials;
  return <View {...props} />;
};

export default InitialsView;
