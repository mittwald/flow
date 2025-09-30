/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { DatePicker, type DatePickerProps } from "@/components/DatePicker";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const DatePickerView: FC<DatePickerProps> = memo((props) => {
  const View = useContext(viewComponentContext)["DatePicker"] ?? DatePicker;
  return <View {...props} />;
});
DatePickerView.displayName = "DatePickerView";

export default DatePickerView;
