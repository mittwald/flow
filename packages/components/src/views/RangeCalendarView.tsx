/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  RangeCalendar,
  type RangeCalendarProps,
} from "@/components/Calendar/components/RangeCalendar/RangeCalendar";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const RangeCalendarView: FC<RangeCalendarProps> = memo((props) => {
  const View =
    useContext(viewComponentContext)["RangeCalendar"] ?? RangeCalendar;
  return <View {...props} />;
});
RangeCalendarView.displayName = "RangeCalendarView";

export default RangeCalendarView;
