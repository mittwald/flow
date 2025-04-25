/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { DateRangePickerProps } from "@/components/DateRangePicker";
import React, { useContext } from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const DateRangePickerView: FC<DateRangePickerProps> = (props) => {
  const View =
    useContext(viewComponentContext)["DateRangePicker"] ?? DateRangePicker;
  return <View {...props} />;
};

export default DateRangePickerView;
