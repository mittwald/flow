/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { TimeFieldProps } from "@/components/TimeField";
import React, { useContext } from "react";
import { TimeField } from "@/components/TimeField";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TimeFieldView: FC<TimeFieldProps> = (props) => {
  const View = useContext(viewComponentContext)["TimeField"] ?? TimeField;
  return <View {...props} />;
};

export default TimeFieldView;
