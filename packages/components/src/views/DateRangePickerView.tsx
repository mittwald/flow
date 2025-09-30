/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  DateRangePicker,
  type DateRangePickerProps,
} from "@/components/DateRangePicker";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const DateRangePickerView: FC<DateRangePickerProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["DateRangePicker"] ?? DateRangePicker;
  return <View {...props} />;
});
DateRangePickerView.displayName = "DateRangePickerView";

export default DateRangePickerView;
