/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  TimeField,
  type TimeFieldProps,
} from "@/components/TimeField/TimeField";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TimeFieldView: FC<TimeFieldProps> = memo((props) => {
  const View = useContext(viewComponentContext)["TimeField"] ?? TimeField;
  return <View {...props} />;
});
TimeFieldView.displayName = "TimeFieldView";

export default TimeFieldView;
